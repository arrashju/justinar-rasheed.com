import { Home } from "@/components/views/Home";
import { hasHeadshot } from "@/lib/headshot";

export default function HomePage() {
  return <Home showHeadshot={hasHeadshot()} />;
}
