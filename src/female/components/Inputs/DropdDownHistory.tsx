import SharedDropdDownHistory from "@/shared/components/Inputs/DropdDownHistory";

const BasicSelect = (props: Parameters<typeof SharedDropdDownHistory>[0]) => (
  <SharedDropdDownHistory {...props} menuBackground="rgba(36, 37, 62, 0.9)" />
);

export default BasicSelect;
