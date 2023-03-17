import dynamic from "next/dynamic";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
}

const NotionPage = ({ recordMap }: NotionPageProps) => {
  return (
    <NotionRenderer
      className="relative sm:w-auto xs:w-96"
      recordMap={recordMap}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf,
      }}
    />
  );
};

export default NotionPage;
