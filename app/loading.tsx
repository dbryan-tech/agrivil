import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 select-none">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#FAF7F2] p-3 shadow-md ring-1 ring-black/5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-[22px] bg-[#DF8821]/20 opacity-75" />
        <Image
          src="/agrivil-mark.svg"
          alt="AgriVil Loading"
          width={48}
          height={48}
          className="relative z-10 h-full w-full object-contain animate-pulse"
          priority
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[13px] font-extrabold tracking-[0.14em] uppercase text-[#0B3B25]">
          AGRIVIL
        </p>
        <p className="text-xs font-semibold text-[#5C5247]">
          Gathering fresh morning harvest…
        </p>
      </div>
    </div>
  )
}
