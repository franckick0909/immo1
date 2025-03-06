"use client";

import BorderGlowButton from "@/components/ui/borderGlowButton";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";

export default function SettingsButton() {
  return (
    <Link href="/profile/settings">
      <BorderGlowButton icon={IoSettingsOutline}>Paramètres</BorderGlowButton>
    </Link>
  );
}
