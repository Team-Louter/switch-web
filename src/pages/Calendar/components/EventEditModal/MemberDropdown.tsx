import { useState, useRef, useEffect } from "react";
import * as S from "./MemberDropdown.styled";
import { dummyMembers } from "@/constants/dummy";
import type { Member } from "@/types/member";
import { IoIosArrowBack } from "react-icons/io";
import { getGenerations } from "@/utils/FormatFilters";
import { formatAssignees } from "@/utils/FormatAssignee";

interface MemberDropdownProps {
    selectedMemberIds: number[];
    onSelectChange: (memberIds: number[]) => void;
}

export default function MemberDropdown({ selectedMemberIds, onSelectChange }: MemberDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedGenerations, setExpandedGenerations] = useState<Set<number | 'all'>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const generationLabels = getGenerations(dummyMembers);

    const getGenKey = (label: string): number | 'all' =>
        label === '전체' ? 'all' : parseInt(label);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getMembersByGeneration = (gen: number | 'all'): Member[] => {
        if (gen === 'all') return dummyMembers;
        return dummyMembers.filter(m => m.generation === gen);
    };

    const isGenerationFullySelected = (gen: number | 'all'): boolean => {
        const members = getMembersByGeneration(gen);
        return members.length > 0 && members.every(m => selectedMemberIds.includes(m.id));
    };

    const toggleGeneration = (gen: number | 'all') => {
        const members = getMembersByGeneration(gen);
        const memberIds = members.map(m => m.id);
        const allSelected = isGenerationFullySelected(gen);

        if (allSelected) {
            onSelectChange(selectedMemberIds.filter(id => !memberIds.includes(id)));
        } else {
            const newSelected = new Set([...selectedMemberIds, ...memberIds]);
            onSelectChange(Array.from(newSelected));
        }
    };

    const toggleMember = (memberId: number) => {
        if (selectedMemberIds.includes(memberId)) {
            onSelectChange(selectedMemberIds.filter(id => id !== memberId));
        } else {
            onSelectChange([...selectedMemberIds, memberId]);
        }
    };

    const toggleExpand = (gen: number | 'all') => {
        const newExpanded = new Set(expandedGenerations);
        if (newExpanded.has(gen)) {
            newExpanded.delete(gen);
        } else {
            newExpanded.add(gen);
        }
        setExpandedGenerations(newExpanded);
    };

    const getDisplayText = (): string => {
        if (selectedMemberIds.length === 0) return '담당자 선택';

        const selectedNames = dummyMembers
            .filter(m => selectedMemberIds.includes(m.id))
            .map(m => m.name);

        return formatAssignees(selectedNames);
    };

    const renderGenerationGroup = (gen: number | 'all', label: string) => (
        <div key={gen}>
            <S.GenerationHeader $selected={isGenerationFullySelected(gen)}>
                <S.GenerationLeft onClick={() => toggleGeneration(gen)}>
                    <S.Label $selected={isGenerationFullySelected(gen)}>
                        {label}
                    </S.Label>
                </S.GenerationLeft>
                <S.ArrowIcon
                    $isOpen={expandedGenerations.has(gen)}
                    onClick={() => toggleExpand(gen)}
                >
                    <IoIosArrowBack />
                </S.ArrowIcon>
            </S.GenerationHeader>

            {expandedGenerations.has(gen) && (
                <S.MemberList>
                    {getMembersByGeneration(gen).map(member => (
                        <S.MemberItem
                            key={member.id}
                            onClick={() => toggleMember(member.id)}
                            $selected={selectedMemberIds.includes(member.id)}
                        >
                            <S.Label $selected={selectedMemberIds.includes(member.id)}>
                                {member.name}
                            </S.Label>
                        </S.MemberItem>
                    ))}
                </S.MemberList>
            )}
        </div>
    );

    return (
        <S.Container ref={dropdownRef}>
            <S.DropdownButton
                onClick={() => setIsOpen(!isOpen)}
                $isOpen={isOpen}
                $hasSelection={selectedMemberIds.length > 0}
            >
                <span>{getDisplayText()}</span>
                <S.ArrowIcon $isOpen={isOpen}><IoIosArrowBack /></S.ArrowIcon>
            </S.DropdownButton>

            {isOpen && (
                <S.DropdownMenu>
                    {generationLabels.map(label =>
                        renderGenerationGroup(getGenKey(label), label)
                    )}
                </S.DropdownMenu>
            )}
        </S.Container>
    );
}