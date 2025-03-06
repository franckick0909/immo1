import {
  IoBarChart,
  IoGrid,
  IoPeople,
  IoSettings,
  IoPersonOutline,
  IoShieldOutline,
  IoNotificationsOutline,
  IoChatboxOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";

import { FiSettings } from "react-icons/fi";

const icons = {
  IoBarChart,
  IoGrid,
  IoPeople,
  IoSettings,
  IoSettingsOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoNotificationsOutline,
  IoChatboxOutline,
  IoLogOutOutline,
} as const;

const fiIcons = {
  FiSettings,
} as const;

export type IconName = keyof typeof icons;
export type FiIconName = keyof typeof fiIcons;
export function getIcon(iconName: IconName) {
  const Icon = icons[iconName];
  return <Icon className="text-xl" />;
}

export function getFiIcon(iconName: FiIconName) {
  const Icon = fiIcons[iconName];
  return <Icon className="text-xl" />;
}
