// services/storageServices.ts
import { supabase } from '@/lib/supabase';

export async function uploadShopLogo(
  shopId: string,
  localUri: string,
): Promise<string> {
  const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `shops/${shopId}/logo.${ext}`;
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const response = await fetch(localUri);
  const blob = await response.blob();

  // Upload blob directly to Supabase Storage
  const { error } = await supabase.storage
    .from('shop-assets')
    .upload(path, blob, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw error;

  // Return the public URL
  const { data } = supabase.storage.from('shop-assets').getPublicUrl(path);

  return data.publicUrl;
}
