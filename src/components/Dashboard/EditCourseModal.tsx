import { CourseInterface, LEVELS } from '@/types';
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
import { ChangeEvent, FC, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { Fragment } from 'react/jsx-runtime';
import Input from '../common/Input';
import { useEmptyInput } from '@/hooks/useEmptyInput';
import axios from 'axios';
import { useCourses } from '@/hooks/useCourses';
import { useNotify } from '@/hooks/useNotify';
import { useClient } from '@/hooks/useClient';

interface EditCourseModalInterface {
  course: CourseInterface;
}

interface EditCourseInterface {
  id: number;
  title: string;
  description: string;
  level: LEVELS;
  nameUrl: string;
  imageUrl?: string;
}

const EditCourseModal: FC<EditCourseModalInterface> = ({ course }) => {
  // States
  const [formData, setFormData] = useState<EditCourseInterface>({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    nameUrl: course.nameUrl,
    imageUrl: course?.imageUrl || '',
  });
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [levelToSend, setLevelToSend] = useState<string>(course.level);

  // Hooks
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setCourses } = useCourses();
  const { notifySuccess, notifyError } = useNotify();
  const { isAccessExpired } = useClient();
  const emptyTitle = useEmptyInput(formData.title);
  const emptyDescription = useEmptyInput(formData.description);
  const emptyNameUrl = useEmptyInput(formData.nameUrl);

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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   Funcion para cambiar el nivel del curso
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (e: any) => {
    setLevelToSend(e.target.value);
    setFormData({
      ...formData,
      level: e.target.value,
    });
  };
  const levels = [LEVELS.BASIC, LEVELS.INTERMEDIATE, LEVELS.ADVANCED];

  //   Petición para editar curso
  const handleEditCourse = async (onClose: () => void) => {
    setLoadingButton(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');
    try {
      await axios
        .put(`${import.meta.env.VITE_API_URL}admin/editCourse`, formData, {
          headers: {
            Authorization: `Bearer ${access}`,
            refresh_token: refresh,
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
          await handleEditCourse(onClose);
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

  //   Funcion para habilitar el boton editar
  const isBottonSubmitDisabled = () => {
    if (
      (formData.title === course.title &&
        formData.description === course.description &&
        formData.level === course.level &&
        formData.nameUrl === course.nameUrl) ||
      emptyTitle ||
      emptyDescription ||
      emptyNameUrl
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
                <p className='line-clamp-2'>{course.title}</p>
              </ModalHeader>

              <ModalBody>
                <form className='flex flex-col gap-3'>
                  {/* TITULO */}
                  <Input
                    name='title'
                    type='text'
                    value={formData.title}
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
                    value={formData.description}
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
                    value={formData.nameUrl}
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
                  onPress={() => handleEditCourse(onClose)}
                  isDisabled={isBottonSubmitDisabled() ? true : false}
                >
                  Editar curso
                </Button>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCourseModal;
