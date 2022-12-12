/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "mp4box" {
  export function createFile(): any;

  export interface Edit {
    media_rate_fraction: number;
    media_rate_integer: number;
    media_time: number;
    segment_duration: number;
  }

  export interface Matrix {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
  }

  export interface Kind {
    schemeURI: string;
    value: string;
  }

  export interface Video {
    height: number;
    width: number;
  }

  export interface Audio {
    channel_count: number;
    sample_rate: number;
    sample_size: number;
  }

  export interface AudioTrack {
    alternate_group: number;
    audio: Audio;
    bitrate: number;
    codec: string;
    created: string;
    duration: number;
    edits: Edit[];
    id: number;
    kind: Kind;
    language: string;
    layer: number;
    matrix: Matrix;
    modified: string;
    movie_duration: number;
    movie_timescale: number;
    name: string;
    nb_samples: number;
    references: any[];
    samples_duration: number;
    size: number;
    timescale: number;
    track_height: number;
    track_width: number;
    type: string;
    volume: number;
  }

  export interface VideoTrack {
    alternate_group: number;
    bitrate: number;
    codec: string;
    created: string;
    duration: number;
    edits: Edit[];
    id: number;
    kind: Kind;
    language: string;
    layer: number;
    matrix: Matrix;
    modified: string;
    movie_duration: number;
    movie_timescale: number;
    name: string;
    nb_samples: number;
    references: any[];
    samples_duration: number;
    size: number;
    timescale: number;
    track_height: number;
    track_width: number;
    type: string;
    video: Video;
    volume: number;
  }

  export interface Mp4BoxInfo {
    audioTracks: AudioTrack[];
    brands: string[];
    created: string;
    duration: number;
    hasIOD: boolean;
    hasMoov: boolean;
    hintTracks: any[];
    isFragmented: boolean;
    isProgressive: boolean;
    metadataTracks: any[];
    mime: string;
    modified: string;
    otherTracks: any[];
    subtitleTracks: any[];
    timescale: number;
    tracks: Array<AudioTrack | VideoTrack>;
    videoTracks: VideoTrack[];
  }

  interface BaseBox {
    size: number;
    type: string;
  }

  export interface MoovBox extends BaseBox {
    traks: TrakBox[];
    type: "moov";
  }

  export interface TrakBox extends BaseBox {
    mdia: MdiaBox;
    type: "trak";
  }

  export interface MdiaBox extends BaseBox {
    minf: MinfBox;
    type: "mdia";
  }

  export interface MinfBox extends BaseBox {
    stbl: StblBox;
    type: "minf";
  }
  export interface StblBox extends BaseBox {
    stsd: StsdBox;
    type: "stbl";
  }

  export interface StsdBox extends BaseBox {
    entries: Box[];
    type: "stsd";
  }

  export interface Mp4aBox extends BaseBox {
    esds: EsdsBox;
    type: "mp4a";
  }
  export interface EsdsBox extends BaseBox {
    esd: Descriptor;
    type: "esds";
  }

  export type Box =
    | EsdsBox
    | MdiaBox
    | MinfBox
    | MoovBox
    | Mp4aBox
    | StblBox
    | StsdBox
    | TrakBox;

  interface Descriptor {
    data?: Uint8Array;
    descs: Descriptor[];
    tag: number;
  }

  export interface ISOFile {
    getInfo(): Mp4BoxInfo;
    getTrackSamplesInfo(track_id: number): any;
    moov: MoovBox;
  }

  export interface TrackSample {
    alreadyRead: number;
    chunk_index: number;
    chunk_run_index: number;
    cts: number;
    degradation_priority: number;
    depends_on: number;
    description: Description;
    description_index: number;
    dts: number;
    duration: number;
    has_redundancy: number;
    is_depended_on: number;
    is_leading: number;
    is_sync: boolean;
    number: number;
    offset: number;
    size: number;
    timescale: number;
    track_id: number;
  }
}

// Start Samples
export interface TrackDescriptionBox {
  AVCLevelIndication: number;
  AVCProfileIndication: number;
  PPS: PP[];
  SPS: SP[];
  configurationVersion: number;
  data: Data;
  hSpacing?: number;
  hdr_size: number;
  lengthSizeMinusOne: number;
  nb_PPS_nalus: number;
  nb_SPS_nalus: number;
  profile_compatibility: number;
  size: number;
  start: number;
  type: string;
  vSpacing?: number;
}

export interface AvcC {
  AVCLevelIndication: number;
  AVCProfileIndication: number;
  PPS: any;
  SPS: any;
  configurationVersion: number;
  hdr_size: number;
  lengthSizeMinusOne: number;
  nb_PPS_nalus: number;
  nb_SPS_nalus: number;
  profile_compatibility: number;
  size: number;
  start: number;
  type: string;
}

export interface Pasp {
  data: any;
  hSpacing: number;
  hdr_size: number;
  size: number;
  start: number;
  type: string;
  vSpacing: number;
}

export interface Description {
  avcC: AvcC;
  boxes: TrackDescriptionBox[];
  compressorname: string;
  data_reference_index: number;
  depth: number;
  frame_count: number;
  hdr_size: number;
  height: number;
  horizresolution: number;
  pasp: Pasp;
  size: number;
  start: number;
  type: string;
  vertresolution: number;
  width: number;
}
// End Samples
