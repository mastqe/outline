import { buildDocument } from "@server/test/factories";
import { getTestDatabase } from "@server/test/support";
import Revision from "./Revision";

const db = getTestDatabase();

afterAll(db.disconnect);

beforeEach(async () => {
  await db.flush();
  jest.resetAllMocks();
});

describe("#findLatest", () => {
  test("should return latest revision", async () => {
    const document = await buildDocument({
      title: "Title",
      text: "Content",
    });
    await Revision.createFromDocument(document);
    document.title = "Changed 1";
    await document.save();
    await Revision.createFromDocument(document);
    document.title = "Changed 2";
    await document.save();
    await Revision.createFromDocument(document);
    const revision = await Revision.findLatest(document.id);
    expect(revision?.title).toBe("Changed 2");
    expect(revision?.text).toBe("Content");
  });
});
