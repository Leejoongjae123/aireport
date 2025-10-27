"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [requestManagementOpen, setRequestManagementOpen] = useState(true);
  const [embeddingManagementOpen, setEmbeddingManagementOpen] = useState(false);

  const menuItems = [
    { label: "대시보드", href: "/admin/dashboard" },
    { label: "회원 관리", href: "/admin/members" },
    { label: "보고서 생성 관리", href: "/admin/reports" },
  ];

  const expandableMenus = [
    {
      label: "요청 관리",
      href: "/admin/requests",
      isOpen: requestManagementOpen,
      toggle: () => setRequestManagementOpen(!requestManagementOpen),
      subItems: [
        {
          label: "전문가 평가 요청",
          href: "/admin/requests/expert-evaluation",
        },
        {
          label: "전문가 컨설팅 요청",
          href: "/admin/requests/expert-consulting",
        },
      ],
    },
    {
      label: "임베딩 관리",
      href: "/admin/embeddings",
      isOpen: embeddingManagementOpen,
      toggle: () => setEmbeddingManagementOpen(!embeddingManagementOpen),
      subItems: [
        { label: "보고서 임베딩", href: "/admin/embeddings/reports" },
        { label: "전문가 정보 임베딩", href: "/admin/embeddings/experts" },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="fixed left-0 top-0 z-40 w-[220px] min-h-screen h-full bg-white border-r border-[#D9D9D9] pt-[24px] mt-[78px]">
      {/* Regular Menu Items */}
      {menuItems.map((item, index) => (
        <Link href={item.href} key={index}>
          <div
            className={`flex w-[220px] px-6 h-[44px] items-center gap-[10px] border-b border-r border-[#D9D9D9] cursor-pointer hover:bg-gray-50 ${
              isActive(item.href) ? "bg-gray-100" : ""
            }`}
          >
            <div
              className={`font-pretendard text-base font-semibold leading-[150%] tracking-[-0.32px] ${
                isActive(item.href) ? "text-blue-600" : "text-[#303030]"
              }`}
            >
              {item.label}
            </div>
          </div>
        </Link>
      ))}

      {/* Expandable Menu Items */}
      {expandableMenus.map((menu, index) => (
        <div key={index}>
          {/* Main Menu Item */}
          <div
            className="flex w-[220px] px-6 py-[10px] justify-between items-center border-b border-r border-[#D9D9D9] cursor-pointer hover:bg-gray-50"
            onClick={menu.toggle}
          >
            <div className="text-[#2A2A2A] font-pretendard text-base font-semibold leading-[150%] tracking-[-0.32px]">
              {menu.label}
            </div>
            {menu.isOpen ? (
              <ChevronUp className="w-5 h-5 text-[#717171]" strokeWidth={2} />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#717171]" strokeWidth={2} />
            )}
          </div>

          {/* Sub Menu Items */}
          {menu.isOpen && (
            <div className="flex w-[220px] px-6 flex-col items-start border-r border-[#D9D9D9]">
              {menu.subItems.map((subItem, subIndex) => (
                <Link href={subItem.href} key={subIndex} className="w-full">
                  <div
                    className={`flex py-[10px] px-[10px] justify-start items-center gap-[10px] cursor-pointer hover:bg-gray-50 w-full ${
                      isActive(subItem.href) ? "bg-gray-100" : ""
                    }`}
                  >
                    <div
                      className={`font-pretendard text-base font-semibold leading-[150%] tracking-[-0.32px] text-start ${
                        isActive(subItem.href)
                          ? "text-blue-600"
                          : "text-[#6A6A6A]"
                      }`}
                    >
                      {subItem.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
