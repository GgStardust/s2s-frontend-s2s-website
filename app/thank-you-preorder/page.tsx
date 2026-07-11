import { redirect } from 'next/navigation';

/** Legacy preorder URL; purchase flow is /order/direct → /order/success */
export default function ThankYouPreorderRedirect() {
  redirect('/order/success');
}
