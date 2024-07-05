import { FC, Fragment, useState } from 'react';
import { CourseInterface } from '@/types';
import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { MdDelete } from 'react-icons/md';
// import { useNavigate } from 'react-router-dom';
import { SiGitbook } from 'react-icons/si';
import EditCourseModal from '../Dashboard/EditCourseModal';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useCourses } from '@/hooks/useCourses';
import { useClient } from '@/hooks/useClient';

interface CourseCardInterface {
  course: CourseInterface;
}

const CourseCardAdmin: FC<CourseCardInterface> = ({ course }) => {
  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess, notifyError } = useNotify();
  const { setCourses } = useCourses();
  const { isAccessExpired } = useClient();
  //   const navigate = useNavigate();

  //   Functions
  // Función para redirecciónar a la lista de clases de un curso (dashboard)
  const handlePress = (course: CourseInterface) => {
    console.log(course);
  };

  //   Petición para Eliminar el curso curso
  const handleDeleteCourse = async (onClose: () => void) => {
    setLoadingButton(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .delete(`${import.meta.env.VITE_API_URL}admin/deleteCourse`, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
          },
          data: {
            id: course.id,
          },
        })
        .then((res) => {
          const { data, message } = res.data;
          // Actualizamos los datos con la respuesta
          setCourses(data);
          notifySuccess(message, 'dashboardToast');
          setLoadingButton(false);
          onClose();
        });
    } catch (error) {
      // Manejamos los diferentes errores
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await handleDeleteCourse(onClose);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message, 'dashboardToast');
          setLoadingButton(false);
        }
      } else if (errorStatus === 3) {
        notifyError(
          'Tu sesión ha caducado, vuelve a iniciar sesión',
          'dashboardToast'
        );
        setLoadingButton(false);
        onClose();
      }
    }
  };

  return (
    <Card
      className='bg-primary/20 text-white-p'
      key={course.id}
      as='div'
      isPressable
      onClick={() => handlePress(course)}
    >
      <CardBody className='flex flex-row h-[90px] gap-3'>
        {/* Imagen */}
        {/* Agregamos esta validación para evitar que caiga en true
        Ya uqe de momento no sabemos exactamente como manejaremos las imagenes */}
        {course.imageUrl === 'xd' ? (
          <figure>
            <Image
              isBlurred
              alt='Imagen que ilustra un astronauta'
              className='w-full max-w-[65px]'
              src={`${import.meta.env.VITE_API_IMGS_URL}${course.imageUrl}.jpg`}
            />
          </figure>
        ) : (
          <SiGitbook className='w-[65px] h-[55px] self-center text-primary' />
        )}

        {/* Titulo */}
        <section className='flex-1 self-center'>
          <p className='line-clamp-2 font-semibold'>{course.title}</p>
        </section>

        {/* Flecha */}
        <section
          className='flex-center flex-col gap-3'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Boton editar */}
          <EditCourseModal course={course} />

          {/* Boton eliminar */}
          <button
            className='p-1 bg-error rounded-lg'
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            <MdDelete className='w-[18px] h-[18px]' />
          </button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop='blur'
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose) => (
                <Fragment>
                  <ModalBody className='pt-8'>
                    <p>
                      Estas seguro que deseas eliminar el curso "
                      <span className='text-primary font-semibold'>
                        {course.title}
                      </span>
                      "
                    </p>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      className='bg-error/30 text-error'
                      onPress={onClose}
                      type='button'
                    >
                      No
                    </Button>
                    <Button
                      isLoading={loadingButton}
                      color='primary'
                      type='button'
                      onPress={() => handleDeleteCourse(onClose)}
                    >
                      Si
                    </Button>
                  </ModalFooter>
                </Fragment>
              )}
            </ModalContent>
          </Modal>
        </section>
      </CardBody>
    </Card>
  );
};

export default CourseCardAdmin;
