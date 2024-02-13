'use client';
import { AvailableLanguageTag, setLanguageTag } from '../src/paraglide/runtime';

export function ClientLanguageProvider(props: { language: AvailableLanguageTag }) {
  setLanguageTag(props.language);
  return null;
}
