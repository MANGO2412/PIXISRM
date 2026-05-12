export interface Range {
    start: string;
    end: string;
}

export interface ColorInfo {
    primaries: string;
    transferCharacteristics: string;
    matrixCoefficients: string;
}

export interface AdaptiveFormat {
    itag: number;
    url?: string;
    mimeType: string;
    bitrate: number;
    width?: number;
    height?: number;
    initRange?: Range;
    indexRange?: Range;
    lastModified: string;
    contentLength: string;
    quality: string;
    fps?: number;
    qualityLabel?: string;
    projectionType: string;
    averageBitrate: number;
    approxDurationMs: string;
    qualityOrdinal: string;
    colorInfo?: ColorInfo;
    highReplication?: boolean;
    audioQuality?: string;
    audioSampleRate?: string;
    audioChannels?: number;
    loudnessDb?: number;
    trackAbsoluteLoudnessLkfs?: number;
}

export interface StreamingData {
    adaptiveFormats: AdaptiveFormat[];
}

export interface PlayabilityStatus {
    status: string;
}

export interface AudioConfig {
    loudnessDb: number;
    perceptualLoudnessDb: number;
    enablePerFormatLoudness: boolean;
    trackAbsoluteLoudnessLkfs: number;
    loudnessTargetLkfs: number;
}

export interface PlayerConfig {
    audioConfig: AudioConfig;
}

export interface VideoDetails {
    videoId: string;
}

export interface PlayerResponse {
    playabilityStatus: PlayabilityStatus;
    streamingData: StreamingData;
    videoDetails: VideoDetails;
    playerConfig?: PlayerConfig;
}


