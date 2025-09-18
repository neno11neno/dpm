import { useLoading } from '../../context/LoadingContext';
import { useApi } from '../../api';

const ExamplePage = () => {
  const { setLoading } = useLoading();
  const { apiGet } = useApi();
  const handleFetch = async () => {
    const res = await apiGet('/todos/1', setLoading);
    alert(JSON.stringify(res, null, 2));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>測試 API + Loading</h1>
      <button onClick={handleFetch}>載入測試資料</button>
    </div>
  );
};

export default ExamplePage;
