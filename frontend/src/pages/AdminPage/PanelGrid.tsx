import AgGrid from "../../components/AgGrid/AgGrid";
import { useFetch } from "../../shared/hooks/useFetch";

interface PanelProps {
    url: string;
}
const PanelGrid = ({ url }: PanelProps) => {
    const { data, loading } = useFetch(url);

    console.log({ data });
    const rowData = data ? data.rowLines : [];

    console.log({ rowData });

    return <AgGrid rowData={[]} loading={loading} />;
};

export default PanelGrid;
