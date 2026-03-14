import SharedDropdown from "@/shared/components/Inputs/Dropdown";

const SelectVariants = (props: Parameters<typeof SharedDropdown>[0]) => (
  <SharedDropdown {...props} menuBackground="rgba(0, 0, 0, 0.9)" />
);

export default SelectVariants;
