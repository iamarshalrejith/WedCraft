import { Metadata } from "next";
import { getDb } from "@/lib/mongodb";
import { formatWeddingDate } from "@/lib/invite-utils";
import ClientPage from "./client-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const db = await getDb();
    const invite = await db.collection("invites").findOne(
      { slug },
      { projection: { coupleDetails: 1 } }
    );

    if (!invite) {
      return { title: "Wedding Invitation | WedCraft" };
    }

    const { groomName, brideName, weddingDate, venue } = invite.coupleDetails;
    const dateStr = formatWeddingDate(weddingDate);
    const title = `${groomName} & ${brideName} | Wedding Invitation`;
    const description = `Join us to celebrate the wedding of ${groomName} & ${brideName} on ${dateStr} at ${venue}. ❤️`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${appUrl}/invite/${slug}`,
        siteName: "WedCraft",
        type: "website",
        images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630, alt: title }],
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Wedding Invitation | WedCraft" };
  }
}

export default function InvitePage({ params }: Props) {
  return <ClientPage params={params} />;
}