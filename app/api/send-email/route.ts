import { type NextRequest, NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";
import { render } from "@react-email/render";
import ContactNotificationEmail from "@/components/emails/contact-notification";
import ThankYouEmail from "@/components/emails/thank-you";
import WaitlistNotificationEmail from "@/components/emails/waitlist-notification";
import WaitlistConfirmationEmail from "@/components/emails/waitlist-confirmation";
import { Redis } from "@upstash/redis";

// Create a new redis client.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Define the type for the request body
interface EmailRequestBody {
  message: string;
  email?: string;
  name?: string;
  type?: "contact" | "waitlist";
  productName?: string;
}

// Define type for email response
interface EmailResponse {
  messageId: string;
}

// Environment validation schema
const envSchema = z.object({
  GMAIL_APP_ID: z.string().min(1),
  GMAIL_APP_PASSWORD: z.string().min(1),
  EMAIL_TO: z.string().email(),
});

type EnvSchema = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): EnvSchema {
  const parsed = envSchema.safeParse({
    GMAIL_APP_ID: process.env.GMAIL_APP_ID,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    EMAIL_TO: process.env.EMAIL_TO,
  });

  if (!parsed.success) {
    throw new z.ZodError(parsed.error.errors);
  }

  return parsed.data;
}

const emailSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message too long"),
  email: z.string().email("Invalid email address").optional(),
  name: z.string().optional(),
  type: z.enum(["contact", "waitlist"]).optional().default("contact"),
  productName: z.string().optional(),
}).refine(
  (data) => {
    // If it's a waitlist signup, email is required
    if (data.type === "waitlist") {
      return !!data.email;
    }
    return true;
  },
  {
    message: "Email is required for waitlist signup",
    path: ["email"],
  }
);

// Separate function to send confirmation email in the background
async function sendConfirmationEmail(
  transporter: Transporter,
  senderEmail: string,
  name: string | undefined,
  message: string,
  fromEmail: string,
  type: "contact" | "waitlist",
  productName?: string,
) {
  try {
    let confirmationEmailHtml: string;
    let subject: string;

    if (type === "waitlist") {
      confirmationEmailHtml = await render(
        WaitlistConfirmationEmail({ 
          email: senderEmail, 
          productName: productName || "Product" 
        })
      );
      subject = `Welcome to the ${productName || "Product"} waitlist!`;
    } else {
      confirmationEmailHtml = await render(ThankYouEmail({ name, message }));
      subject = "Thank you for your message!";
    }

    const viewerMailOptions = {
      from: fromEmail,
      to: senderEmail,
      subject,
      html: confirmationEmailHtml,
    };

    await transporter.sendMail(viewerMailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    const validEnv = validateEnv();

    const body = (await request.json()) as EmailRequestBody;
    const { message, email, name, type, productName } = emailSchema.parse(body);

    if (type === "waitlist" && email && productName) {
      const waitlistKey = `waitlist:${productName}`;
      const isMember = await redis.sismember(waitlistKey, email);
      if (isMember) {
        return NextResponse.json(
          {
            success: false,
            error: "You are already on the waitlist for this product.",
          },
          { status: 409 } // Conflict
        );
      }
    }

    // Create a transporter object using Gmail SMTP settings
    const transporter: Transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: validEnv.GMAIL_APP_ID,
        pass: validEnv.GMAIL_APP_PASSWORD,
      },
    });

    // Verify transporter
    await new Promise((resolve, reject) => {
      transporter.verify((error: Error | null) => {
        if (error) {
          console.log("Transporter verification error:", error);
          reject(error);
        } else {
          console.log("Ready to Send");
          resolve(true);
        }
      });
    });

    // Generate HTML for notification email using React Email
    let notificationEmailHtml: string;
    let subject: string;

    if (type === "waitlist") {
      notificationEmailHtml = await render(
        WaitlistNotificationEmail({ 
          email: email || "No email provided", 
          productName: productName || "Product" 
        }),
      );
      subject = `New Waitlist Signup - ${productName || "Product"}`;
    } else {
      notificationEmailHtml = await render(
        ContactNotificationEmail({ name, email, message }),
      );
      subject = "New Contact Form Message from Portfolio";
    }

    // Email to you (the portfolio owner)
    const myMailOptions = {
      from: email ?? "noreply.portfolio@gmail.com",
      to: validEnv.EMAIL_TO,
      subject,
      html: notificationEmailHtml,
    };

    // Send email to you
    const myResponse = (await transporter.sendMail(
      myMailOptions,
    )) as EmailResponse;

    // Add user to waitlist in Redis if applicable
    if (type === "waitlist" && email && productName) {
      const waitlistKey = `waitlist:${productName}`;
      await redis.sadd(waitlistKey, email);
    }

    // Send confirmation email to the sender in the background (if email provided)
    if (email) {
      // Fire and forget - don't await (makes user experience feels faster)
      void sendConfirmationEmail(
        transporter,
        email,
        name,
        message,
        validEnv.EMAIL_TO,
        type,
        productName,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      myResponse: myResponse.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    if (error instanceof z.ZodError) {
      // Determine if it's an environment validation error or form validation error
      const isEnvError = error.errors.some((err) =>
        ["GMAIL_APP_ID", "GMAIL_APP_PASSWORD", "EMAIL_TO"].includes(
          err.path[0] as string,
        ),
      );

      if (isEnvError) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Email service not configured. Please contact the administrator.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again later.",
      },
      { status: 500 },
    );
  }
}
