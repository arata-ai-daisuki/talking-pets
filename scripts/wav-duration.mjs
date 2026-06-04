function wavDurationSeconds(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 44) return null;
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    return null;
  }

  let byteRate = null;
  let dataSize = null;
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkDataOffset = offset + 8;
    const nextOffset = chunkDataOffset + chunkSize + (chunkSize % 2);

    if (chunkDataOffset + chunkSize > buffer.length) return null;

    if (chunkId === "fmt " && chunkSize >= 16) {
      byteRate = buffer.readUInt32LE(chunkDataOffset + 8);
    } else if (chunkId === "data") {
      dataSize = chunkSize;
    }

    if (byteRate && dataSize != null) {
      return dataSize / byteRate;
    }

    offset = nextOffset;
  }

  return null;
}

function setLatencyAudioDurationFromWav(profile, buffer) {
  if (!profile) return null;
  const seconds = wavDurationSeconds(buffer);
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  profile.audioDurationSeconds = seconds;
  return seconds;
}

function latencyAudioFields(profile) {
  const audioDurationSeconds = profile?.audioDurationSeconds;
  if (audioDurationSeconds == null) return {};

  const fields = {
    audioDuration: formatAudioDurationSeconds(audioDurationSeconds),
  };
  const synthesis = findLatencyStep(profile, "synthesis");
  if (synthesis) {
    fields.rtf = formatRealTimeFactor((synthesis.ms / 1000) / audioDurationSeconds);
  }
  return fields;
}

function findLatencyStep(profile, name) {
  if (!Array.isArray(profile?.steps)) return null;
  for (let i = profile.steps.length - 1; i >= 0; i -= 1) {
    if (profile.steps[i]?.name === name) return profile.steps[i];
  }
  return null;
}

function formatAudioDurationSeconds(seconds) {
  return `${seconds.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}s`;
}

function formatRealTimeFactor(factor) {
  return `${factor.toFixed(2)}x`;
}

export {
  formatAudioDurationSeconds,
  formatRealTimeFactor,
  latencyAudioFields,
  setLatencyAudioDurationFromWav,
  wavDurationSeconds,
};
