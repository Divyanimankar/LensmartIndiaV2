
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const topics = {
      order: "Order Status & Tracking",
      product: "Product Information",
      delivery: "Delivery Question",
      return: "Return / Replacement",
      other: "Other",
    };

    if (!topics[subject]) {
      return Response.json(
        { success: false, message: "Invalid subject." },
        { status: 400 }
      );
    }

    const safe = (value) =>
      String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `New Contact Message - ${topics[subject]}`,
      html: `
        <h2>New LensMartIndia Customer Message</h2>
        <p><strong>Name:</strong> ${safe(name)}</p>
        <p><strong>Email:</strong> ${safe(email)}</p>
        <p><strong>Phone:</strong> ${safe(phone || "Not provided")}</p>
        <p><strong>Subject:</strong> ${topics[subject]}</p>
        <h3>Customer Message:</h3>
        <p>${safe(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Email error:", error);
      return Response.json(
        { success: false, message: "Email could not be sent." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("Contact API error:", error);

    return Response.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
