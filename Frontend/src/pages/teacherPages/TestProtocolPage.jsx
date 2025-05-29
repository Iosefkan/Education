import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PaginatedData from "../../components/PaginatedData";
import BaseAnswer from "../../components/questionAnswers/BaseAnswer";
import Layout from "../../components/Layout";
import { getTestProtocol } from "../../services/teacher.service";
import {
  getModuleCrumbs,
  getCourseCrumbs,
  getPractCrumbs,
} from "../../services/crumbsHelper";

const TestProtocolPage = () => {
  const { state } = useLocation();
  const { testResultId, username, practName, tryNumber } = state;
  const courseCrumbs = getCourseCrumbs();
  const moduleCrumbs = getModuleCrumbs();
  const practCrumbs = getPractCrumbs();
  const paths = [
    {
      active: false,
      to: "/courses",
      id: 1,
      state: {},
      label: "Курсы",
    },
    {
      active: false,
      to: "/course",
      id: 2,
      state: courseCrumbs,
      label: `Курс "${courseCrumbs.courseTitle}"`,
    },
    {
      active: false,
      to: "/module",
      id: 3,
      state: moduleCrumbs,
      label: `Раздел "${moduleCrumbs.moduleTitle}"`,
    },
    {
      active: false,
      to: "/makeTest",
      id: 4,
      state: practCrumbs,
      label: `Практический материал "${practName}"`,
    },
    {
      active: true,
      to: "/testProtocol",
      id: 5,
      state: state,
      label: `Протокол тестирования пользователя "${username}", попытка №${tryNumber}`,
    },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState({});

  useEffect(() => {
    async function InitProtocol() {
      const rec = await getTestProtocol(testResultId);
      setResult(rec);
      setIsLoading(false);
    }
    InitProtocol();
  }, [testResultId, setResult]);
  return (
    <Layout paths={paths}>
      <h2 className="mb-4">
        Протокол выполнения теста "{practName}" студентом "{username}", попытка №{tryNumber}
      </h2>
      {!isLoading && (
        <>
          <h5 className="mb-3">
            <br />
            Оценка за тест: {result.grade}
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
