import { Mail } from "lucide-react";
import { ContactInbox } from "@/components/admin/contact-inbox";
import { listContactMessages } from "@/lib/db/services/contact";

export const metadata = { title: "Messages" };

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  let items: Awaited<ReturnType<typeof listContactMessages>> = [];
  let loadError: string | undefined;

  try {
    items = await listContactMessages();
  } catch (error) {
    console.error("Contact inbox load failed:", error);
    loadError = "Unable to load messages. Check the database connection.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        <p className="mt-1 flex items-center gap-1.5 text-gray-600">
          <Mail className="h-4 w-4" />
          People who wrote in from the public Contact page.
        </p>
      </div>

      <ContactInbox initialItems={items} initialError={loadError} />
    </div>
  );
}
