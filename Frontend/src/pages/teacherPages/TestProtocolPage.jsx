import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PaginatedData from "../../components/PaginatedData";
import BaseAnswer from "../../components/questionAnswers/BaseAnswer";
import Layout from "../../components/Layout";
import { getTestProtocol } from "../../services/teacher.service";
import getGrade from "../../services/gradingHelper";

const TestProtocolPage = () => {
  const { state } = useLocation();
  const { userId, username, practName, practId } = state;

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState({});

  useEffect(() => {
    async function InitProtocol() {
      const rec = await getTestProtocol(practId, userId);
      setResult(rec);
      setIsLoading(false);
    }
    InitProtocol();
  }, [userId, practId, setResult]);
  return (
    <Layout>
      <h2 className="mb-4">
        Протокол выполнения теста "{practName}" студентом {username}
      </h2>
      {!isLoading && (
        <>
          <h5 className="mb-3">
            <br />
            Оценка за тест: {getGrade(result.score, result.maxScore)}
            <br />
            Выполнено: {result.score.toFixed(2)}/{result.maxScore.toFixed(2)},{" "}
            {((result.score / result.maxScore) * 100).toFixed(2)}%
          </h5>
          <PaginatedData
            length={result.answers.length}
            data={result.answers}
            pageSizeOptions={[5, 10, 15]}
          >
            <BaseAnswer />
          </PaginatedData>
        </>
      )}
      {isLoading && <h5>Загрузка протокола...</h5>}
    </Layout>
  );
};

export default TestProtocolPage;
