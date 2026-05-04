import type { TranslationProvider } from "../../domain/lyrics/types";
import { CachedTranslationProvider } from "./cachedTranslationProvider";
import { DemoTranslationProvider } from "./demoTranslationProvider";
import { LibreTranslateProvider } from "./libreTranslateProvider";
import { PersistentTranslationProvider } from "./persistentTranslationProvider";

type TranslationProviderConfig = {
  libreTranslateUrl?: string;
  libreTranslateApiKey?: string;
};

export function createTranslationProvider(config = readTranslationConfig()): TranslationProvider {
  const provider = config.libreTranslateUrl
    ? new LibreTranslateProvider(config.libreTranslateUrl, config.libreTranslateApiKey)
    : new DemoTranslationProvider();

  return new PersistentTranslationProvider(new CachedTranslationProvider(provider));
}

function readTranslationConfig(): TranslationProviderConfig {
  return {
    libreTranslateUrl: process.env.EXPO_PUBLIC_LIBRETRANSLATE_URL,
    libreTranslateApiKey: process.env.EXPO_PUBLIC_LIBRETRANSLATE_API_KEY
  };
}
