import { useFetch } from '@hooks/useFetch';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function FetchDemo() {
  const { data, isLoading, isError, error, refetch } = useFetch<Post>(
    'https://jsonplaceholder.typicode.com/posts/1',
  );

  if (isLoading) return <p>불러오는 중...</p>;
  if (isError) return <p>오류: {error?.message}</p>;

  return (
    <div>
      <h3>{data?.title}</h3>
      <p>{data?.body}</p>
      <button onClick={refetch}>다시 불러오기</button>
    </div>
  );
}
