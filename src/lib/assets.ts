import { supabase } from '@/lib/supabase';
import { Asset, AssetInput } from './types/asset';

const INITIAL_SEED_ASSETS: Asset[] = [
  {
    id: 'placeholder-1',
    title: 'Ultra Low-Latency Network & Packet Tweak',
    category: 'Network Utility',
    slug: 'example-tweak',
    direct_download_url: 'https://example.com',
    file_path: null,
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
    ],
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtube_video_id: 'dQw4w9WgXcQ',
    instructions: "=== ULTRA LOW-LATENCY NETWORK OPTIMIZATION GUIDE ===\n\nOVERVIEW:\nThis optimization modifies Windows TCP/IP parameters, disables Nagle's Algorithm, removes CPU core parking bottlenecks, and tunes network queue depth for sub-millisecond packet pacing in competitive multiplayer games.\n\nSYSTEM REQUIREMENTS:\n- Operating System: Windows 10 / 11 (64-Bit Build 19041 or higher)\n- Privileges: Administrator Rights required to write TCP Registry keys\n- Network Interface: Ethernet LAN Connection recommended (Wi-Fi supported)\n\nSTEP-BY-STEP INSTALLATION:\n\nStep 1: Download & Unpack Package\nClick the DOWNLOAD NOW button to save the verified ZIP archive. Extract the contents to a folder on your Desktop.\n\nStep 2: Create a System Restore Point (Recommended)\nBefore applying system-level network tweaks, create a Windows Restore Point:\n1. Open Start menu, search for 'Create a restore point'.\n2. Select your System drive (C:) and click Create.\n3. Name it 'BrokenCheats Network Tweak Backup'.\n\nStep 3: Execute Optimization Script\n1. Right-click Network_Latency_Tweak.cmd and select Run as Administrator.\n2. Press [1] in the terminal prompt to execute the Automated Registry Optimization.\n3. The script will configure parameters:\n   - TcpAckFrequency = 1 (Disables TCP Delayed ACKs)\n   - TCPNoDelay = 1 (Disables Nagle's Algorithm)\n   - NetworkThrottlingIndex = 0xffffffff (Disables Network Throttling)\n   - SystemResponsiveness = 0 (Prioritizes Gaming I/O)\n\nStep 4: Reboot PC & Enjoy Zero Lag\nRestart your system to apply kernel registry values. Test your ping and input response in-game!",
    ad_fly_link: null,
    download_count: 1337,
    status: 'active',
    created_at: new Date().toISOString()
  }
];

// In-memory fallback store for robust zero-config functionality
let localAssetsStore: Asset[] = [...INITIAL_SEED_ASSETS];

export async function getAllAssets(includeHidden = false): Promise<Asset[]> {
  try {
    let query = supabase.from('assets').select('*').order('created_at', { ascending: false });
    if (!includeHidden) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return includeHidden ? localAssetsStore : localAssetsStore.filter(a => a.status === 'active');
    }
    return data as Asset[];
  } catch {
    return includeHidden ? localAssetsStore : localAssetsStore.filter(a => a.status === 'active');
  }
}

export async function getAssetBySlug(slug: string): Promise<Asset | null> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const match = localAssetsStore.find(a => a.slug === slug);
      return match || null;
    }
    return data as Asset;
  } catch {
    const match = localAssetsStore.find(a => a.slug === slug);
    return match || null;
  }
}

export async function createAsset(input: AssetInput): Promise<Asset> {
  try {
    const newAssetData = {
      ...input,
      download_count: 0,
      status: input.status || 'active',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('assets')
      .insert([newAssetData])
      .select()
      .single();

    if (error || !data) {
      const fallbackAsset: Asset = {
        id: crypto.randomUUID(),
        ...newAssetData
      };
      localAssetsStore.unshift(fallbackAsset);
      return fallbackAsset;
    }

    return data as Asset;
  } catch {
    const fallbackAsset: Asset = {
      id: crypto.randomUUID(),
      title: input.title,
      category: input.category || 'Game Optimizer',
      slug: input.slug,
      direct_download_url: input.direct_download_url || null,
      file_path: input.file_path || null,
      image_url: input.image_url || null,
      gallery_images: input.gallery_images || null,
      video_url: input.video_url || null,
      audio_url: input.audio_url || null,
      youtube_video_id: input.youtube_video_id || null,
      instructions: input.instructions || null,
      ad_fly_link: input.ad_fly_link || null,
      download_count: 0,
      status: input.status || 'active',
      created_at: new Date().toISOString()
    };
    localAssetsStore.unshift(fallbackAsset);
    return fallbackAsset;
  }
}

export async function incrementDownloadCount(slug: string): Promise<number> {
  try {
    const { error } = await supabase.rpc('increment_asset_download', { asset_slug: slug });
    
    if (error) {
      const current = await getAssetBySlug(slug);
      if (current) {
        const newCount = (current.download_count || 0) + 1;
        await supabase.from('assets').update({ download_count: newCount }).eq('slug', slug);
        const local = localAssetsStore.find(a => a.slug === slug);
        if (local) local.download_count = newCount;
        return newCount;
      }
    }
    
    const local = localAssetsStore.find(a => a.slug === slug);
    if (local) {
      local.download_count += 1;
      return local.download_count;
    }

    const fetched = await getAssetBySlug(slug);
    return fetched ? fetched.download_count + 1 : 1;
  } catch {
    const local = localAssetsStore.find(a => a.slug === slug);
    if (local) {
      local.download_count += 1;
      return local.download_count;
    }
    return 1;
  }
}

export async function toggleAssetStatus(slug: string, newStatus: 'active' | 'hidden'): Promise<boolean> {
  try {
    const { error } = await supabase.from('assets').update({ status: newStatus }).eq('slug', slug);
    const local = localAssetsStore.find(a => a.slug === slug);
    if (local) {
      local.status = newStatus;
    }
    return !error;
  } catch {
    const local = localAssetsStore.find(a => a.slug === slug);
    if (local) {
      local.status = newStatus;
      return true;
    }
    return false;
  }
}
