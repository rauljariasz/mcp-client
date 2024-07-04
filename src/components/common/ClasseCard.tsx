import { ClassesInterface, ROLES } from '@/types';
import { FC } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardBody,
} from '@nextui-org/react';
import { TypeAnimation } from 'react-type-animation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { TbEye } from 'react-icons/tb';
import { TbEyeCheck } from 'react-icons/tb';
import { useAuth } from '@/hooks/useAuth';
import { FiLock } from 'react-icons/fi';
import axios from 'axios';
import { useClient } from '@/hooks/useClient';
import { useNotify } from '@/hooks/useNotify';

interface ClasseCardInterface {
  classe: ClassesInterface;
}

const ClasseCard: FC<ClasseCardInterface> = ({ classe }) => {
  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userInfo, updateUserInfo } = useAuth();
  const { isAccessExpired } = useClient();
  const { notifyError } = useNotify();

  // Funcion para abrir el modal
  const handleOpen = async () => {
    // Verificamos si el usuario no tiene la clase vista
    if (!userInfo.viewedClasses.includes(classe.id)) {
      const token = localStorage.getItem('token');
      const refresh = localStorage.getItem('refresh');

      if (!token || !refresh) {
        return;
      }

      markClassAsViewed(token, refresh, classe.id);
    }
    onOpen();
  };

  const markClassAsViewed = async (
    access: string,
    refresh: string,
    classId: number
  ) => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_API_URL}client/markClassAsViewed`,
          { classId },
          {
            headers: {
              Authorization: `Bearer ${access}`,
              refresh_token: refresh,
            },
          }
        )
        .then((res) => {
          const { data } = res.data;
          // Actualizamos los datos del usuario con la respuesta
          updateUserInfo(data);
        });
    } catch (error) {
      // Manejamos los diferentes errores
      const errorStatus = await isAccessExpired(error);
      if (errorStatus === 1) {
        if (axios.isAxiosError(error)) {
          const newToken = error.response?.headers['token'];
          localStorage.setItem('token', newToken);
          await markClassAsViewed(newToken, refresh, classId);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message);
        }
      } else if (errorStatus === 3) {
        notifyError('Tu sesión ha caducado, vuelve a iniciar sesión');
      }
    }
  };

  return (
    <div>
      {userInfo.role === ROLES.PREMIUM ||
      userInfo.role === ROLES.ADMIN ||
      classe.role === ROLES.FREE ? (
        <>
          <Card
            className='bg-primary/20 text-white-p w-full'
            isPressable
            onPress={handleOpen}
          >
            <CardBody className='flex flex-row h-[90px] gap-3'>
              {/* Imagen */}
              {userInfo?.viewedClasses?.includes(classe?.id) ? (
                <TbEyeCheck className='w-[65px] h-[55px] self-center text-primary' />
              ) : (
                <TbEye className='w-[65px] h-[55px] self-center text-primary' />
              )}

              {/* Titulo */}
              <section className='flex-1 self-center'>
                <p className='line-clamp-2 font-semibold'>{classe.title}</p>
              </section>

              {/* Flecha */}
              <section className='flex-center'>
                <MdKeyboardArrowRight className='w-[25px] h-[25px]' />
              </section>
            </CardBody>
          </Card>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            backdrop='blur'
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1 text-primary'>
                    {classe.title}
                  </ModalHeader>
                  <ModalBody>
                    <TypeAnimation
                      sequence={[
                        'Miralo en pantalla completa.',
                        2000,
                        'Sube todo el volumen.',
                        2000,
                      ]}
                      speed={25}
                      className='font-semibold'
                      wrapper='span'
                      repeat={Infinity}
                    />
                    <iframe
                      className='h-[300px] w-full'
                      src={`${classe.videoUrl}`}
                      title='YouTube video player'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      referrerPolicy='strict-origin-when-cross-origin'
                      allowFullScreen
                    ></iframe>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className='bg-error/30 text-error'
                      onPress={onClose}
                    >
                      Cerrar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <Card isPressable className='bg-primary/20 text-white-p w-full'>
            <CardBody className='flex flex-row h-[90px] gap-3'>
              {/* Imagen */}
              <FiLock className='w-[65px] h-[55px] self-center text-primary' />

              {/* Titulo */}
              <section className='flex-1 self-center'>
                <p className='line-clamp-2 font-semibold'>
                  Debes ser <span className='text-warm'>Premium</span> para
                  tener acceso a esta clase
                </p>
              </section>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default ClasseCard;
