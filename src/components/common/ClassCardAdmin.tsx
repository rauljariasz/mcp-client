import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ClassesInterface } from '@/types';
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
import { SiGitbook } from 'react-icons/si';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useClient } from '@/hooks/useClient';
import EditClassModal from '../DashboardCourse/EditClassModal';

interface ClassCardInterface {
  classe: ClassesInterface;
  setClasses: Dispatch<SetStateAction<ClassesInterface[]>>;
}

const ClassCardAdmin: FC<ClassCardInterface> = ({ classe, setClasses }) => {
  // States
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess, notifyError } = useNotify();
  const { isAccessExpired } = useClient();

  //   Petición para Eliminar el curso curso
  const handleDeleteCourse = async (onClose: () => void) => {
    setLoadingButton(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .delete(`${import.meta.env.VITE_API_URL}admin/deleteClass`, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
          },
          data: {
            id: classe.id,
          },
        })
        .then((res) => {
          const { data, message } = res.data;
          // Actualizamos los datos con la respuesta
          setClasses(data);
          notifySuccess(message, 'dashboardCourseToast');
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
          notifyError(error.response?.data?.message, 'dashboardCourseToast');
          setLoadingButton(false);
        }
      } else if (errorStatus === 3) {
        notifyError(
          'Tu sesión ha caducado, vuelve a iniciar sesión',
          'dashboardCourseToast'
        );
        setLoadingButton(false);
        onClose();
      }
    }
  };

  return (
    <Card
      className='bg-primary/20 text-white-p'
      key={classe.id}
      as='div'
      isPressable
    >
      <CardBody className='flex flex-row h-[90px] gap-3'>
        {/* Imagen */}
        {/* Agregamos esta validación para evitar que caiga en true
        Ya uqe de momento no sabemos exactamente como manejaremos las imagenes */}
        {classe.imageUrl === 'xd' ? (
          <figure>
            <Image
              isBlurred
              alt='Imagen que ilustra un astronauta'
              className='w-full max-w-[65px]'
              src={`${import.meta.env.VITE_API_IMGS_URL}${classe.imageUrl}.jpg`}
            />
          </figure>
        ) : (
          <SiGitbook className='w-[65px] h-[55px] self-center text-primary' />
        )}

        {/* Titulo */}
        <section className='flex-1 self-center'>
          <p className='line-clamp-2 font-semibold'>{classe.title}</p>
        </section>

        {/* Flecha */}
        <section
          className='flex-center flex-col gap-3'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Boton editar */}
          <EditClassModal classe={classe} setClasses={setClasses} />

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
                      Estas seguro que deseas eliminar la clase "
                      <span className='text-primary font-semibold'>
                        {classe.title}
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

export default ClassCardAdmin;
