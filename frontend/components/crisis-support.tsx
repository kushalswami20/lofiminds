"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Globe,
  Clock,
  Heart,
  AlertTriangle,
  ExternalLink,
  Copy,
  CheckCircle,
  MessageSquare,
  ShieldAlert,
  Lightbulb,
  Users,
} from "lucide-react"

export function CrisisSupport() {
  const [copiedNumber, setCopiedNumber] = useState("")

  const nationalHelplines = [
    {
      name: "National Suicide Prevention Helpline",
      number: "15115",
      description: "24/7 crisis intervention and suicide prevention",
      availability: "24/7",
      languages: ["Hindi", "English"],
      type: "crisis",
      website: "http://www.aasra.info",
    },
    {
      name: "AASRA - Suicide Prevention",
      number: "9820466726",
      description: "Emotional support and suicide prevention counseling",
      availability: "24/7",
      languages: ["Hindi", "English", "Marathi"],
      type: "crisis",
      website: "http://www.aasra.info",
    },
    {
      name: "Sneha Foundation",
      number: "044-24640050",
      description: "Crisis intervention and emotional support",
      availability: "24/7",
      languages: ["Tamil", "English", "Hindi"],
      type: "crisis",
      location: "Chennai",
    },
    {
      name: "Sumaitri",
      number: "011-23389090",
      description: "Emotional support for people in distress",
      availability: "24/7",
      languages: ["Hindi", "English"],
      type: "support",
      location: "Delhi",
    },
    {
      name: "Sahai",
      number: "080-25497777",
      description: "24-hour helpline for emotional support",
      availability: "24/7",
      languages: ["English", "Hindi", "Kannada"],
      type: "support",
      location: "Bangalore",
    },
    {
      name: "Roshni Helpline",
      number: "040-66202000",
      description: "Counseling and emotional support services",
      availability: "11 AM - 9 PM",
      languages: ["Telugu", "English", "Hindi"],
      type: "support",
      location: "Hyderabad",
    },
  ]

  const specializedSupport = [
    {
      category: "Women's Helpline",
      services: [
        { name: "Women Helpline", number: "181", description: "24/7 support for women in distress" },
        { name: "Domestic Violence Helpline", number: "1091", description: "Support for domestic violence victims" },
      ],
    },
    {
      category: "Child Helpline",
      services: [
        { name: "Childline India", number: "1098", description: "24/7 helpline for children in need" },
        { name: "Child Abuse Prevention", number: "1800-121-2830", description: "Report child abuse and get support" },
      ],
    },
    {
      category: "Mental Health",
      services: [
        { name: "NIMHANS Helpline", number: "080-46110007", description: "Mental health support and guidance" },
        { name: "Vandrevala Foundation", number: "9999666555", description: "Mental health and suicide prevention" },
      ],
    },
  ]

  const onlineResources = [
    {
      name: "YourDOST",
      description: "Online counseling and emotional wellness platform",
      website: "https://yourdost.com",
      type: "counseling",
    },
    {
      name: "BetterHelp India",
      description: "Professional online therapy sessions",
      website: "https://betterhelp.com",
      type: "therapy",
    },
    {
      name: "Manastha",
      description: "Mental health awareness and support",
      website: "https://manastha.com",
      type: "awareness",
    },
    {
      name: "The Live Love Laugh Foundation",
      description: "Mental health awareness and resources",
      website: "https://www.thelivelovelaughfoundation.org",
      type: "awareness",
    },
  ]

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number)
    setCopiedNumber(number)
    setTimeout(() => setCopiedNumber(""), 2000)
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      crisis: "bg-red-100 text-red-800",
      support: "bg-blue-100 text-blue-800",
      counseling: "bg-green-100 text-green-800",
      therapy: "bg-purple-100 text-purple-800",
      awareness: "bg-yellow-100 text-yellow-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Crisis Support & Helplines</h1>
        <p className="text-white/90">Immediate help and support resources across India</p>
      </div>

      {/* Emergency Alert */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">In Immediate Crisis?</h3>
              <p className="text-red-700 mb-4">
                If you're having thoughts of self-harm or suicide, please reach out immediately. You are not alone, and
                help is available.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.open("tel:15115")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call 15115 Now
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => window.open("tel:9820466726")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  AASRA: 9820466726
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* National Helplines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-6 h-6 text-blue-600" />
            <span>National Crisis Helplines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {nationalHelplines.map((helpline, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{helpline.name}</h4>
                      {helpline.location && <p className="text-sm text-gray-500">{helpline.location}</p>}
                    </div>
                    <Badge className={getTypeColor(helpline.type)}>{helpline.type}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{helpline.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-semibold text-blue-600">{helpline.number}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(helpline.number)}>
                          {copiedNumber === helpline.number ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="sm" onClick={() => window.open(`tel:${helpline.number}`)}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{helpline.availability}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>{helpline.languages.join(", ")}</span>
                      </div>
                    </div>

                    {helpline.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start p-0 h-auto text-blue-600 hover:text-blue-700"
                        onClick={() => window.open(helpline.website, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialized Support */}
      <div className="grid md:grid-cols-3 gap-6">
        {specializedSupport.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.services.map((service, serviceIndex) => (
                <div key={serviceIndex} className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-800">{service.name}</h5>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-blue-600">{service.number}</span>
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${service.number}`)}>
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Online Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-green-600" />
            <span>Online Mental Health Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {onlineResources.map((resource, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                    <Badge className={getTypeColor(resource.type)}>{resource.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => window.open(resource.website, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Platform
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Self-Care Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Heart className="w-6 h-6" />
            <span>While You Wait for Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">Immediate Coping Strategies:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Take slow, deep breaths (4 counts in, 6 counts out)</li>
                <li>• Ground yourself: name 5 things you can see, 4 you can touch</li>
                <li>• Reach out to a trusted friend or family member</li>
                <li>• Remove yourself from harmful situations if possible</li>
                <li>• Use the meditation tools in this app</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-800">Remember:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• You are not alone in this struggle</li>
                <li>• These feelings are temporary and will pass</li>
                <li>• Seeking help is a sign of strength, not weakness</li>
                <li>• Professional help is available and effective</li>
                <li>• Your life has value and meaning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Emergency Help Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <ShieldAlert className="w-6 h-6" />
            <span>Immediate Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            If you are in immediate danger or experiencing a life-threatening emergency, please call your local
            emergency services right away.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Services (e.g., 911)
            </Button>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Phone className="w-4 h-4 mr-2" />
              National Suicide Prevention Lifeline
              <br />
              (Call or Text 988 in the US)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Chat & Text Support Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <MessageSquare className="w-6 h-6" />
            <span>Chat & Text Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Connect with trained crisis counselors via text or chat for confidential support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Crisis Text Line (Text HOME to 741741)
            </Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Users className="w-4 h-4 mr-2" />
              The Trevor Project (LGBTQ Youth)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Additional Resources Section */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <Lightbulb className="w-6 h-6" />
            <span>Additional Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Mental Health America:</strong> Provides information, advocacy and resources for mental-health
              conditions.
              <a href="#" className="text-blue-600 hover:underline ml-2">
                Learn More
              </a>
            </li>
            <li>
              <strong>NAMI&nbsp;(National Alliance on Mental Illness):</strong> Offers support, education and advocacy
              for individuals and families affected by mental illness.
              <a href="#" className="text-blue-600 hover:underline ml-2">
                Learn More
              </a>
            </li>
            <li>
              <strong>SAMHSA (Substance Abuse and Mental Health Services Administration):</strong> National helpline for
              substance-abuse and mental-health services.
              <a href="#" className="text-blue-600 hover:underline ml-2">
                Learn More
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-gray-600 text-sm mt-8">
        <p>Remember, you are not alone. Help is available.</p>
      </div>
    </div>
  )
}
