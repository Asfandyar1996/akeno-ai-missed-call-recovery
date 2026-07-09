import type { Metadata } from "next";
import { MissedCallSimulator } from "@/components/demo/missed-call-simulator";

export const metadata: Metadata = {
  title: "Interactive Demo | Akeno",
  description: "Interactive Akeno missed-call recovery simulator for roofing lead intake."
};

export default function DemoPage() {
  return <MissedCallSimulator />;
}
