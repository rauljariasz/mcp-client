import { ClassesInterface, ROLES } from '@/types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { Fragment } from 'react/jsx-runtime';
import Input from '../common/Input';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useClient } from '@/hooks/useClient';

interface EditClassModalInterface {
  classe: ClassesInterface;
  setClasses: Dispatch<SetStateAction<ClassesInterface[]>>;
}

interface EditClassInterface {
  id: number;
  title: string;
  description: string;
  role: ROLES;
  videoUrl: string;
}

const EditClassModal: FC<EditClassModalInterface> = ({
  classe,
  setClasses,
}) => {
  // States
  const [formData, setFormData] = useState<EditClassInterface>({
    id: classe.id,
    title: classe.title,
    description: classe.description,
    role: classe.role,
    videoUrl: classe.videoUrl,
  });
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [roleToSend, setRoleToSend] = useState<string>(classe.role);

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess, notifyError } = useNotify();
  const { isAccessExpired } = useClient();
  const emptyTitle = useEmptyInput(formData.title);
  const emptyDescription = useEmptyInput(formData.description);
  const emptyVideoUrl = useEmptyInput(formData.videoUrl);

  //   Functions
  // Función para controlar los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // *--------------* //
    // Prevalidaciones //
    // *------------* //

    // Title
    if (name === 'title') {
      if (value.length > 50) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   Funcion para cambiar el nivel del curso
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (e: any) => {
    setRoleToSend(e.target.value);
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };
  const levels = [ROLES.FREE, ROLES.PREMIUM];

  //   Petición para editar curso
  const handleEditClass = async (onClose: () => void) => {
    setLoadingButton(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .put(`${import.meta.env.VITE_API_URL}admin/editClass`, formData, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
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
          await handleEditClass(onClose);
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

  //   Funcion para habilitar el boton editar
  const isBottonSubmitDisabled = () => {
    if (
      (formData.title === classe.title &&
        formData.description === classe.description &&
        formData.role === classe.role) ||
      emptyTitle ||
      emptyDescription ||
      emptyVideoUrl
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <button
        className='p-1 bg-primary rounded-lg'
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        <MdEdit className='w-[18px] h-[18px]' />
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
              <ModalHeader className='flex flex-col gap-1 text-primary'>
                <p className='line-clamp-2'>{classe.title}</p>
              </ModalHeader>

              <ModalBody>
                <form className='flex flex-col gap-3'>
                  {/* TITULO */}
                  <Input
                    name='title'
                    type='text'
                    value={formData.title}
                    label='Nombre de la clase'
                    handleChange={handleChange}
                    error={emptyTitle}
                  />

                  {/* DESCRIPCION */}
                  <Textarea
                    variant='bordered'
                    labelPlacement='outside'
                    placeholder='Descripción de la clase'
                    defaultValue='NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components.'
                    className='bg-black-p rounded-2xl max-h-[200px]'
                    classNames={{
                      inputWrapper: [
                        'border-black-p',
                        'group-data-[focus=true]:border-primary',
                      ],
                    }}
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={emptyDescription}
                  />

                  {/* LEVEL */}
                  <Select
                    label='Rol minimo permitido'
                    variant='bordered'
                    placeholder='Rol minimo permitido'
                    selectedKeys={[roleToSend]}
                    className='bg-black-p rounded-2xl'
                    onChange={handleSelectionChange}
                  >
                    {levels.map((level) => (
                      <SelectItem key={level}>{level}</SelectItem>
                    ))}
                  </Select>

                  {/* nameUrl */}
                  <Input
                    name='videoUrl'
                    type='text'
                    value={formData.videoUrl}
                    label='URL del video'
                    handleChange={handleChange}
                    error={emptyVideoUrl}
                  />
                </form>
              </ModalBody>

              <ModalFooter>
                <Button
                  className='bg-error/30 text-error'
                  onPress={onClose}
                  type='button'
                >
                  Cerrar
                </Button>
                <Button
                  isLoading={loadingButton}
                  color='primary'
                  type='button'
                  onPress={() => handleEditClass(onClose)}
                  isDisabled={isBottonSubmitDisabled() ? true : false}
                >
                  Editar clase
                </Button>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditClassModal;
