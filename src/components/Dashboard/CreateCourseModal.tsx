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
import { LEVELS } from '@/types';
import { ChangeEvent, Fragment, useState } from 'react';
import axios from 'axios';
import { useNotify } from '@/hooks/useNotify';
import { useCourses } from '@/hooks/useCourses';
import { useClient } from '@/hooks/useClient';

interface courseInfo {
  title: string;
  description: string;
  level: LEVELS;
  nameUrl: string;
  imageUrl?: string;
}

const CreateCourseModal = () => {
  // States
  const [courseInfo, setCourseInfo] = useState<courseInfo>({
    title: '',
    description: '',
    level: LEVELS.BASIC,
    nameUrl: '',
    imageUrl: '',
  });
  const [levelToSend, setLevelToSend] = useState<string>('');
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { notifySuccess, notifyError } = useNotify();
  const { setCourses } = useCourses();
  const { isAccessExpired } = useClient();
  const emptyTitle = useEmptyInput(courseInfo.title);
  const emptyDescription = useEmptyInput(courseInfo.description);
  const emptyNameUrl = useEmptyInput(courseInfo.nameUrl);

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

    // name URL
    if (name === 'nameUrl') {
      const regex = /^[a-z-]*$/;
      if (value.length > 20 || !regex.test(value)) {
        return;
      }
    }

    setCourseInfo({
      ...courseInfo,
      [name]: value,
    });
  };

  //   Funcion para cambiar el nivel del curso
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (e: any) => {
    setLevelToSend(e.target.value);
    setCourseInfo({
      ...courseInfo,
      level: e.target.value,
    });
  };

  //   Funcion para saber si se habilita el boton de de añadir
  const isBottonSubmitDisabled = () => {
    if (
      courseInfo.title.length < 1 ||
      courseInfo.description.length < 1 ||
      courseInfo.nameUrl.length < 1 ||
      levelToSend === ''
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
        .post(`${import.meta.env.VITE_API_URL}admin/createCourse`, courseInfo, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
          },
        })
        .then((res) => {
          const { data } = res.data;
          // Actualizamos los datos con la respuesta
          setCourses(data);
          notifySuccess('Curso creado exitosamente.', 'dashboardToast');
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
          notifyError(error.response?.data?.message, 'dashboardToast');
          setLoadingButton(false);
          onClose();
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
  const levels = [LEVELS.BASIC, LEVELS.INTERMEDIATE, LEVELS.ADVANCED];

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
                Añadir nuevo curso
              </ModalHeader>

              <ModalBody>
                {/* FORM */}
                <form className='flex flex-col gap-3'>
                  {/* TITULO */}
                  <Input
                    name='title'
                    type='text'
                    value={courseInfo.title}
                    label='Nombre del curso'
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
                    value={courseInfo.description}
                    onChange={handleChange}
                    isInvalid={emptyDescription}
                  />

                  {/* LEVEL */}
                  <Select
                    label='Nivel'
                    variant='bordered'
                    placeholder='Selecciona el nivel de dificultad'
                    selectedKeys={[levelToSend]}
                    className='bg-black-p rounded-2xl'
                    onChange={handleSelectionChange}
                  >
                    {levels.map((level) => (
                      <SelectItem key={level}>{level}</SelectItem>
                    ))}
                  </Select>

                  {/* nameUrl */}
                  <Input
                    name='nameUrl'
                    type='text'
                    value={courseInfo.nameUrl}
                    label='Nombre de URL'
                    handleChange={handleChange}
                    error={emptyNameUrl}
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

export default CreateCourseModal;
