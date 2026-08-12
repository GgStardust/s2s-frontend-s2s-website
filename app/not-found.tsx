import { redirect } from 'next/navigation'

/** Unknown routes go home rather than a dead-end 404 page. */
export default function NotFound() {
  redirect('/')
}
