import type { Metadata } from "next";
import { RecoveryStoryDemo } from "@/app/demo-chat/page";

export const metadata: Metadata = {
  title: "Recovery Story | Akeno",
  description: "An animated Akeno missed-call recovery story for roofing lead intake."
};

export default function DemoPage() {
  return <RecoveryStoryDemo />;
}
