import { questions as archiveQuestions } from "./ai-native-prototype";
import editorial from "./record-editorial.json";
import editorialSources from "./record-editorial-sources.generated.json";
export const questions = archiveQuestions.map((q) => ({
  ...q,
  evidence: q.evidence.map((item) => {
    if (!item.video)
      throw new Error(
        `Missing recording: ${q.id}:${item.speaker}:${item.timestamp}`,
      );
    const editorialKey =
      `${q.id}:${item.speaker}:${item.timestamp}` as keyof typeof editorial;
    const story = editorial[editorialKey];
    const source = editorialSources[editorialKey];
    if (!story || !source)
      return {
        ...item,
        video: item.video,
        editorialKey,
        story: null,
        storySource: null,
      };
    const video = new URL(item.video);
    video.searchParams.set(
      "t",
      String(
        source.timestamp.split(":").reduce((n, v) => n * 60 + Number(v), 0),
      ) + "s",
    );
    return {
      ...item,
      editorialKey,
      story,
      storySource: source,
      timestamp: source.timestamp,
      video: video.toString(),
      transcript: source.transcript,
    };
  }),
}));
