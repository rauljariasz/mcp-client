import { FC } from 'react';
import { ToastContainer } from 'react-toastify';
import UsersSearch from './UsersSearch';
import Chart from 'react-apexcharts';

interface SearchQuantityUserInterface {
  usersQuantity: {
    free: number;
    premium: number;
  };
}

const SearchQuantityUser: FC<SearchQuantityUserInterface> = ({
  usersQuantity,
}) => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      text: '', // Changed 'show' to 'text'
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#ff8f00', '#00897b'],
    legend: {
      show: false,
    },
    labels: ['Free', 'Premium'],
  };

  return (
    <section className='flex flex-col md:flex-row gap-5'>
      <ToastContainer theme='colored' draggable className='md:w-[600px]' />

      {/* Buscar usuario */}
      <UsersSearch />

      {/* Cantidad de usuarios */}
      <div className='md:w-1/2 flex flex-col items-center md:flex-row md:justify-center'>
        {/* Area Chart */}
        <Chart
          options={options}
          series={[usersQuantity?.free, usersQuantity?.premium]}
          type='pie'
          width={230}
          height={230}
        />

        {/* Leyenda */}
        <div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='w-3 h-3 bg-[#ff8f00] rounded-full'></span> Free
          </div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='w-3 h-3 bg-[#00897b] rounded-full'></span> Premium
          </div>
          <div className='flex items-center gap-2 font-semibold'>
            <span className='w-3 h-3 bg-[#fff] rounded-full'></span> Usuarios
            totales: {usersQuantity?.premium + usersQuantity?.free}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchQuantityUser;
