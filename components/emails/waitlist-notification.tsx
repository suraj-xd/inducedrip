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
} from "@react-email/components";

interface WaitlistNotificationEmailProps {
  email: string;
  productName?: string;
}

export default function WaitlistNotificationEmail({
  email,
  productName = "Product",
}: WaitlistNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New waitlist signup for {productName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>🎯 New Waitlist Signup!</Heading>
            
            <Text style={paragraph}>
              Someone just joined the waitlist for <strong>{productName}</strong>!
            </Text>

            <Hr style={hr} />

            <Text style={paragraph}>
              <strong>Email:</strong> {email}
            </Text>
            
            <Text style={paragraph}>
              <strong>Product:</strong> {productName}
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              This notification was sent from your 3D Object Viewer waitlist system.
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

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginTop: "20px",
}; 