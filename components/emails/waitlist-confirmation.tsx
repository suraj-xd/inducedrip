import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Button,
} from "@react-email/components";

interface WaitlistConfirmationEmailProps {
  email: string;
  productName?: string;
}

export default function WaitlistConfirmationEmail({
  email,
  productName = "Product",
}: WaitlistConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the {productName} waitlist!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>🎉 You're on the waitlist!</Heading>
            
            <Text style={paragraph}>
              Thanks for joining the waitlist for <strong>{productName}</strong>!
            </Text>

            <Text style={paragraph}>
              We're excited to have you as part of our early community. You'll be among the first to know when <strong>{productName}</strong> becomes available.
            </Text>
            <Text style={paragraph}>Here is you digital stickers:</Text>
            <Img src="https://i.postimg.cc/3rfcmH2H/Frame-55.jpg" alt="Digital Stickers" width="100%" height="auto" />
            
            <Section style={buttonContainer}>
              <Link
                href="https://drive.google.com/file/d/1sQSI70mcBZzCvkIP9WI9paj7FAHdNO-A/view?usp=sharing"
                style={button}
              >
                Download Digital Stickers
              </Link>
            </Section>
            
            <Hr style={hr} />

            <Text style={paragraph}>
              <strong>What happens next?</strong>
            </Text>
            
            <Text style={paragraph}>
              • We'll email you as soon as {productName} is ready<br />
              • You'll get exclusive early access<br />
              • Plus, we promised you some free digital stickers! 🎁
            </Text>

            <Hr style={hr} />

            <Text style={paragraph}>
              In the meantime, feel free to explore our other 3D products and customization options.
            </Text>

            <Text style={footer}>
              Thanks for your patience,<br />
              The 3D Object Viewer Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "1.4",
  marginBottom: "15px",
};

const hr = {
  borderColor: "#ddd",
  margin: "20px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "25px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
  cursor: "pointer",
};

const footer = {
  color: "#484848",
  fontSize: "16px",
  marginTop: "30px",
  fontWeight: "500",
}; 