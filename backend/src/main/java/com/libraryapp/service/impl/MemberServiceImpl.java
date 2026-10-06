package com.libraryapp.service.impl;

import com.libraryapp.entity.Member;
import com.libraryapp.exception.DuplicateResourceException;
import com.libraryapp.exception.ResourceNotFoundException;
import com.libraryapp.repository.MemberRepository;
import com.libraryapp.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    @Override
    public Member addMember(Member member) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new DuplicateResourceException("A member with email " + member.getEmail() + " already exists");
        }
        return memberRepository.save(member);
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    @Override
    public Member updateMember(Long id, Member updated) {
        Member existing = getMemberById(id);
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setAddress(updated.getAddress());
        return memberRepository.save(existing);
    }

    @Override
    public void deleteMember(Long id) {
        Member existing = getMemberById(id);
        memberRepository.delete(existing);
    }
}
