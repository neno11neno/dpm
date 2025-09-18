import { useLoading } from '../contexts/LoadingContext';

const ExamplePage = () => {
  const { setLoading } = useLoading();

  const handleFetchData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>範例頁面</h1>
      <button onClick={handleFetchData}>模擬載入</button>
    </div>
  );
};

export default ExamplePage;
