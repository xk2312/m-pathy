import React from "react";
import ArchiveIcon from "./archive";
import SettingsIcon from "./settings";
import NewChatIcon from "./new_chat";
import CsvDownloadIcon from "./csv_download";
import JsonDownloadIcon from "./json_download";


export const ICON_REGISTRY: Record<string, React.ReactNode> = {
  archive: <ArchiveIcon />,
  settings: <SettingsIcon />,
  new_chat: <NewChatIcon />,
  csv_download: <CsvDownloadIcon />,
  json_download: <JsonDownloadIcon />,
};