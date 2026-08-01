import { supabase } from '../lib/supabase';

const LOCATION_CONSENT_KEY = 'scsgo_location_consent_v1';
export const LOCATION_POLICY_VERSION = '2026-08-01';

interface StoredConsent {
  granted: boolean;
  version: string;
  grantedAt: string;
}

export function hasLocationConsent() {
  try {
    const value = window.localStorage.getItem(LOCATION_CONSENT_KEY);
    if (!value) return false;
    const consent = JSON.parse(value) as StoredConsent;
    return consent.granted && consent.version === LOCATION_POLICY_VERSION;
  } catch {
    return false;
  }
}

export async function grantLocationConsent(userId: string) {
  const grantedAt = new Date().toISOString();
  const { error } = await supabase.from('user_consents').insert({
    user_id: userId,
    consent_type: 'precise_location',
    policy_version: LOCATION_POLICY_VERSION,
    granted: true,
    purposes: ['nearest_station', 'route_planning'],
    granted_at: grantedAt,
  });
  if (error) throw error;
  const consent: StoredConsent = { granted: true, version: LOCATION_POLICY_VERSION, grantedAt };
  window.localStorage.setItem(LOCATION_CONSENT_KEY, JSON.stringify(consent));
}

export async function revokeLocationConsent(userId: string) {
  const { error } = await supabase.from('user_consents').insert({
    user_id: userId,
    consent_type: 'precise_location',
    policy_version: LOCATION_POLICY_VERSION,
    granted: false,
    purposes: ['nearest_station', 'route_planning'],
    revoked_at: new Date().toISOString(),
  });
  if (error) throw error;
  window.localStorage.removeItem(LOCATION_CONSENT_KEY);
}
