import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';

type ControlComponentsData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>(
    {
      activePage: 0
    }
  );

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({ activePage: pageNumber });
  };

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 6,
      },
    };

    requestBackend(config)
      .then((response) => {
        setPage(response.data);
      });
  }, [controlComponentsData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <div className="employee-crud-container">
      <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>

      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={(page) ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default List;
