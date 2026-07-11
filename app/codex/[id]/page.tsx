import { redirect } from 'next/navigation';

export default function CodexEssayRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/source-field/${params.id}`);
}
