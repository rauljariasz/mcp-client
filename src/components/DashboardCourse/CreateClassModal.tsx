import { FiPlusCircle } from 'react-icons/fi';
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
import Input from '../common/Input';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import { ClassesInterface, ROLES } from '@/types';
import {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useState,
} from 'react';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useClient } from '@/hooks/useClient';

interface classInfo {
  title: string;
  description: string;
  role: ROLES;
  routeId: number;
  videoUrl: string;
}

const CreateClassModal: FC<{
  courseId: number;
  setClasses: Dispatch<SetStateAction<ClassesInterface[]>>;
}> = ({ courseId, setClasses }) => {
  // States
  const [formData, setFormData] = useState<classInfo>({
    title: '',
    description: '',
    role: ROLES.FREE,
    routeId: courseId,
    videoUrl: '',
  });
  const [roleToSend, setRoleToSend] = useState<string>(ROLES.FREE);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

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

  //   Funcion para saber si se habilita el boton de de añadir
  const isBottonSubmitDisabled = () => {
    if (
      formData.title.length < 1 ||
      formData.description.length < 1 ||
      formData.videoUrl.length < 7 ||
      roleToSend === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  //   Petición para crear el curso
  const handleCreateCourse = async (onClose: () => void) => {
    setLoadingButton(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .post(`${import.meta.env.VITE_API_URL}admin/createClass`, formData, {
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
          await handleCreateCourse(onClose);
          return;
        }
      } else if (errorStatus === 2) {
        if (axios.isAxiosError(error)) {
          notifyError(error.response?.data?.message, 'dashboardCourseToast');
          setLoadingButton(false);
          onClose();
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
  const roles = [ROLES.FREE, ROLES.PREMIUM];

  return (
    <>
      <button onClick={onOpen}>
        <FiPlusCircle className='w-7 h-7 text-warm' />
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
                Añadir nueva clase
              </ModalHeader>

              <ModalBody>
                {/* FORM */}
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
                    placeholder='Descripción del curso'
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
                    placeholder='Selecciona el Rol minimo permitido'
                    selectedKeys={[roleToSend]}
                    className='bg-black-p rounded-2xl'
                    onChange={handleSelectionChange}
                  >
                    {roles.map((rol) => (
                      <SelectItem key={rol}>{rol}</SelectItem>
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
                  onPress={() => handleCreateCourse(onClose)}
                  isDisabled={isBottonSubmitDisabled() ? true : false}
                >
                  Añadir curso
                </Button>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateClassModal;
