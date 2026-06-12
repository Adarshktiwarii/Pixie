// @ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Stethoscope, AlertTriangle, Building, Bone } from "lucide-react";

export default function Contacts() {
  const contactGroups = [
    {
      title: "Emergency & Owners",
      contacts: [
        { name: "Adarsh Kumar Tiwari", role: "Primary Owner / Emergency", phone: "+91 91316 20063", type: "owner", icon: AlertTriangle, color: "bg-rose-100 text-rose-600" },
        { name: "Upasana Shil", role: "Secondary Caregiver / Emergency", phone: "+91 84848 46980", type: "owner", icon: AlertTriangle, color: "bg-rose-100 text-rose-600" },
      ]
    },
    {
      title: "Veterinary Care",
      contacts: [
        { name: "Dr Yatish Gowda", role: "Primary Veterinarian", phone: "Call Clinic", clinic: "Leela Pet Clinic HSR Layout", reg: "KVC 5647", type: "vet", icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
        { name: "Dr Anushka Upadhyay", role: "Remote Consultation Vet", phone: "Available via app", type: "vet", icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
      ]
    },
    {
      title: "Breeder & Clinics",
      contacts: [
        { name: "Sooraj Furry Tails", role: "Breeder", phone: "+91 98860 61208", details: "Purchased on May 26, 2026", type: "breeder", icon: Bone, color: "bg-amber-100 text-amber-600" },
        { name: "Waggles Up Pet Store and Spa", role: "Pet Clinic / Store", phone: "N/A", type: "clinic", icon: Building, color: "bg-emerald-100 text-emerald-600" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contacts</h1>
        <p className="text-slate-500 mt-1">Important people and places for Pixie.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {contactGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">{group.title}</h2>
            <div className="grid gap-4">
              {group.contacts.map((contact, contactIdx) => (
                <Card key={contactIdx} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="p-5 flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${contact.color}`}>
                        <contact.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 leading-none mb-1.5">{contact.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-3">{contact.role}</p>
                        
                        <div className="space-y-2 text-sm text-slate-600">
                          {contact.clinic && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              {contact.clinic}
                            </div>
                          )}
                          {contact.reg && (
                            <div className="flex items-center gap-2">
                              <ClipboardIcon className="h-4 w-4 text-slate-400" />
                              Reg: {contact.reg}
                            </div>
                          )}
                          {contact.details && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-slate-400" />
                              {contact.details}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex gap-3">
                      <a 
                        href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex h-10 items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-amber-600 flex-1 rounded-xl"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        {contact.phone.includes('+') ? 'Call' : contact.phone}
                      </a>
                      <Button variant="outline" size="icon" className="rounded-xl bg-white border-slate-200 hover:bg-slate-50 hover:text-amber-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
