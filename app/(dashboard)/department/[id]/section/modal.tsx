"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newStudent, newTeacher } from "./action";
import { InsertStudentSchema, InsertTeachersSchema } from "@/app/_db/schema";
import { usePathname, useRouter } from "next/navigation";

export function AddStudents({ id }: { id: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const test = usePathname();

  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new students
      </Button>
      <Button onClick={() => router.push(`${test}/${id}/students`)}>
        go to studetns
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateStudentInput id={id} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function AddTeachers({ id }: { id: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const test = usePathname();
  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm">
        new teacher
      </Button>
      <Button onClick={() => router.push(`${test}/${id}/teacher`)}>
        go to teachers
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <ValidateTeacherInput id={id} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
const newTeacherSchema = InsertTeachersSchema.omit({ sectionId: true });
function ValidateTeacherInput({ id }: { id: number }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newTeacherSchema>
  >({
    resolver: zodResolver(newTeacherSchema),
  });

  const [isPending, setTransition] = useTransition();

  function submit(datap: z.infer<typeof newTeacherSchema>) {
    setTransition(async () => {
      await newTeacher(datap.teacherName, id);
    });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("teacherName")}
        placeholder="TeacherName"
        errorMessage={formState.errors.teacherName?.message}
        isInvalid={(formState.errors.teacherName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}

const newStudentSchema = InsertStudentSchema.omit({ sectionId: true });

function ValidateStudentInput({ id }: { id: number }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newStudentSchema>
  >({
    resolver: zodResolver(newStudentSchema),
  });

  const [isPending, setTransition] = useTransition();

  function submit(datap: z.infer<typeof newStudentSchema>) {
    setTransition(async () => {
      await newStudent(datap.studentName, id);
    });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("studentName")}
        placeholder="StudentName"
        errorMessage={formState.errors.studentName?.message}
        isInvalid={(formState.errors.studentName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
