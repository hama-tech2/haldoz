import {EntryHeader} from "../../../components/entry-header";
import {DraftWorkspace} from "../../../components/draft-workspace";
import "../../entry.css";
import "../../owner.css";
import "../../owner/jobs/drafts.css";
export default function DraftDevelopment(){return <div><EntryHeader/><main id="main-content" className="owner-shell drafts-shell"><DraftWorkspace/></main></div>;}
