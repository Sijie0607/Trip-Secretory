/**
 * 插画地址与清单以 public/data/travel-illustration-stems.json 为权威数据源。
 * 仅当 stem 出现在 manifest.stems 中时加载远程图（与中文选项对应的 imageStem 一致）。
 */
import travelStemsManifest from "@/public/data/travel-illustration-stems.json";

type TravelStemsManifest = {
  base: string;
  stems: string[];
};

const manifest = travelStemsManifest as TravelStemsManifest;

const JSON_BASE = manifest.base.replace(/\/$/, "");

/** 环境变量可覆写；否则使用 JSON 中的 base（与仓库 Raw 一致） */
export const TRAVEL_ILLUSTRATIONS_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TRAVEL_ILLUSTRATIONS_BASE?.replace(/\/$/, "")) ||
  JSON_BASE;

/** 清单内有的 stem（与 PNG 文件名无扩展名一致） */
export const TRAVEL_ILLUSTRATION_STEM_SET = new Set(manifest.stems);

export function isPublishedTravelStem(stem: string): boolean {
  return TRAVEL_ILLUSTRATION_STEM_SET.has(stem);
}

/** 仓库当前为 PNG；优先 .png，仍支持 .webp / .jpg */
export const TRAVEL_ILLUSTRATION_EXTS = [".png", ".webp", ".jpg"] as const;

export function travelIllustrationWebpUrl(stem: string): string {
  return `${TRAVEL_ILLUSTRATIONS_BASE}/${stem}.webp`;
}

/** 按清单校验：未在 stems 中的不生成 URL（调用方应不请求图） */
export function travelIllustrationSrc(stem: string, extIndex: number): string {
  const ext =
    TRAVEL_ILLUSTRATION_EXTS[
      Math.min(extIndex, TRAVEL_ILLUSTRATION_EXTS.length - 1)
    ];
  return `${TRAVEL_ILLUSTRATIONS_BASE}/${stem}${ext}`;
}

export function travelIllustrationSrcIfPublished(
  stem: string,
  extIndex: number,
): string | null {
  if (!isPublishedTravelStem(stem)) return null;
  return travelIllustrationSrc(stem, extIndex);
}
