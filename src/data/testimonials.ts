export interface TestimonialItem {
  id: string;
  sourcePage: number;
  parentName: string;
  childName: string;
  className: string;
  language: "en" | "kn";
  image: string;
  imageAlt: string;
  quote: string;
  subheadings?: { title: string; text: string }[];
  featured?: boolean;
}

export const authenticTestimonials: TestimonialItem[] = [
  {
    id: "testimonial-01",
    sourcePage: 1,
    parentName: "Sneha Sharma",
    childName: "K Ahaan Dev",
    className: "Class 2 A1",
    language: "en",
    image: "/images/testimonials/01-sneha-sharma.png",
    imageAlt: "Portrait of parent Sneha Sharma",
    featured: true,
    quote: `I am very happy to share our experience of our child’s journey at SJR Public School. Our child is studying in Class 2, and it has been wonderful to see him learn, grow, and become more confident each day.

We are happy with the positive changes we have seen in his academics, communication, confidence, and overall development. The school provides a safe and supportive environment where children can learn and explore their talents.

We truly feel proud to be a part of the SJR family and look forward to seeing our child achieve many more milestones.

Thank you, SJR Public School, for your love, care, and support!`
  },
  {
    id: "testimonial-02",
    sourcePage: 2,
    parentName: "Swathi K",
    childName: "Ashvi U",
    className: "Class II A2",
    language: "en",
    image: "/images/testimonials/02-swathi-k.png",
    imageAlt: "Portrait of parent Swathi K",
    featured: true,
    quote: `I am happy to share my feedback as a parent and a member of the SJR school community for the past four years.

The teachers are dedicated and patient, helping students understand difficult concepts. Regular class tests and various sports and cultural activities help children build confidence and teamwork.

We appreciate the school’s clean environment, discipline, and well-organized parent-teacher meetings. We are very pleased with Ashvi’s academic, social, and overall development at SJR Public School.

We truly value the strong partnership between parents and teachers and thank the school management and teachers for their continuous support and commitment to our children’s education.`
  },
  {
    id: "testimonial-03",
    sourcePage: 3,
    parentName: "Mohammed Sayeed",
    childName: "Ruzaina Tabassum",
    className: "Class IX A2",
    language: "en",
    image: "/images/testimonials/03-mohammed-sayeed.png",
    imageAlt: "Portrait of parent Mohammed Sayeed",
    featured: true,
    quote: `Our journey with Sri Jagadguru Renukacharya Public School (SJR Public School) has been truly wonderful since our daughter joined Grade V. The school provides a positive and nurturing environment where academic excellence, discipline, values, and character development go hand in hand.

The teachers are dedicated, approachable, and attentive to each child’s individual needs. Their structured yet creative teaching methods have helped our daughter grow academically, develop confidence, and cultivate a genuine love for learning.

We greatly appreciate the school’s excellent communication with parents, which makes us feel like active partners in our child’s education. We are proud to see our daughter grow into a confident and responsible learner.

We sincerely thank the Principal, teachers, and SJR Education Society for their continuous care, guidance, support, and encouragement. We are truly grateful for the positive impact SJR has had on our daughter’s journey.`
  },
  {
    id: "testimonial-04",
    sourcePage: 4,
    parentName: "ವಿದ್ಯಾ ಉಪ್ಪಿನ (Vidya Uppin)",
    childName: "ದೀಕ್ಷಾ ಉಪ್ಪಿನ (Deeksha Uppin)",
    className: "ತರಗತಿ 1A1",
    language: "kn",
    image: "/images/testimonials/04-vidya-uppin.png",
    imageAlt: "Portrait of parent Vidya Uppin (ವಿದ್ಯಾ ಉಪ್ಪಿನ)",
    featured: true,
    quote: `ನಾನು ಶ್ರೀ ಜಗದ್ಗುರು ರೇಣುಕಾಚಾರ್ಯ ಪಬ್ಲಿಕ್ ಶಾಲೆಯಲ್ಲಿ ನನ್ನ ಮಗುವನ್ನು ಓದಿಸುತ್ತಿರುವುದಕ್ಕೆ ತುಂಬಾ ಸಂತೋಷವಾಗುತ್ತಿದೆ. ಶಾಲೆಯ ಉತ್ತಮ ವಾತಾವರಣ, ಶಿಸ್ತು ಮತ್ತು ಗುಣಮಟ್ಟದ ಶಿಕ್ಷಣದಿಂದ ಮಗುವಿನ ಜ್ಞಾನ, ಆತ್ಮವಿಶ್ವಾಸ ಹಾಗೂ ವ್ಯಕ್ತಿತ್ವದಲ್ಲಿ ಉತ್ತಮ ಬೆಳವಣಿಗೆಯನ್ನು ಕಾಣುತ್ತಿದ್ದೇವೆ.

ಶಿಕ್ಷಕರು ಮಕ್ಕಳಿಗೆ ವೈಯಕ್ತಿಕ ಗಮನ ನೀಡಿ, ಪ್ರೀತಿಯಿಂದ ಹಾಗೂ ಸಹನೆಯಿಂದ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತಾರೆ. ಶಿಕ್ಷಣದ ಜೊತೆಗೆ ಸಂಸ್ಕಾರ, ಶಿಸ್ತು, ಕ್ರೀಡೆ, ಸಾಂಸ್ಕೃತಿಕ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಸೃಜನಶೀಲತೆಗೆ ಶಾಲೆ ಉತ್ತಮ ಪ್ರೋತ್ಸಾಹ ನೀಡುತ್ತದೆ.

ನಮ್ಮ ಮಗುವಿನ ಸಮಗ್ರ ಬೆಳವಣಿಗೆಗೆ ಶಾಲೆ ನೀಡುತ್ತಿರುವ ಸಹಕಾರ ಮತ್ತು ಪ್ರೋತ್ಸಾಹಕ್ಕೆ ನಾವು ಹೃತ್ಪೂರ್ವಕ ಧನ್ಯವಾದಗಳನ್ನು ಸಲ್ಲಿಸುತ್ತೇವೆ.`
  },
  {
    id: "testimonial-05",
    sourcePage: 5,
    parentName: "Rangaswamy",
    childName: "Manya R",
    className: "Class 8 A2",
    language: "en",
    image: "/images/testimonials/05-rangaswamy.png",
    imageAlt: "Portrait of parent Rangaswamy",
    quote: `As a parent of Manya R, studying in 8th Grade, section A2 at SJR Public School, I would like to express my sincere appreciation for the school's dedication to quality education.

The teachers are supportive, encouraging, and provide individual attention, which has greatly helped in my child's academic and personal growth. The school offers a safe and disciplined environment along with good infrastructure and balanced co-curricular activities.

Regular parent-teacher interactions keep us well informed about her progress. I am truly grateful to the management, principal, and teachers for their continuous efforts in shaping my child's future.`
  },
  {
    id: "testimonial-06",
    sourcePage: 6,
    parentName: "Jagadish S",
    childName: "Yashas Gowda J",
    className: "Class 7 A1",
    language: "en",
    image: "/images/testimonials/06-jagadish-s.png",
    imageAlt: "Portrait of parent Jagadish S",
    quote: `I would like to extend my heartfelt appreciation for the outstanding support and guidance provided by your teachers. My child is currently studying in 7th standard, and their dedication to fostering both academic excellence and personal growth is truly commendable.

The teachers create an encouraging and inclusive environment where students feel motivated to learn and ask questions. Their patience and innovative teaching methods have made difficult concepts easier to understand and have greatly boosted my child's confidence.

Beyond academics, the values, discipline, and encouragement instilled in students are shaping them into responsible individuals. I am grateful for their consistent efforts, approachable nature, and regular updates on my child's progress.

Thank you once again for your hard work and commitment to shaping young minds.`
  },
  {
    id: "testimonial-07",
    sourcePage: 7,
    parentName: "Sridevi S",
    childName: "Sahithi S",
    className: "Class VIII A1",
    language: "en",
    image: "/images/testimonials/07-sridevi-s.png",
    imageAlt: "Portrait of parent Sridevi S",
    quote: `I am writing this testimonial to express my sincere gratitude and appreciation to Sri Jagadguru Renukacharya Public School (SJRPS) for their continuous support and guidance in my daughter's education. My daughter, Sahithi S, has been studying in this school since Nursery, and she is currently in Standard VIII A1.

Over the years, I have seen remarkable growth in her academics, personality, and values. The teachers are dedicated, caring, and always approachable. They not only focus on the syllabus but also give attention to moral values, discipline, and overall personality development. Whenever she faced difficulties in understanding any concept, the teachers patiently guided her and helped her overcome them.

The school provides a safe and supportive environment where children can freely explore their interests. The co-curricular activities, competitions, and school events have given her many opportunities to build her self-confidence and showcase her talents.

I sincerely thank the Principal, teachers, and management of SJRPS for creating such a nurturing learning atmosphere. I am proud to be a part of the SJRPS family and wish the institution continued success in shaping the future of young minds.`
  },
  {
    id: "testimonial-08",
    sourcePage: 8,
    parentName: "Mahesh Gowda",
    childName: "Mokshitha M Gowda",
    className: "Class III A2",
    language: "en",
    image: "/images/testimonials/08-mahesh-gowda.png",
    imageAlt: "Family portrait of parent Mahesh Gowda and family",
    quote: `I am happy to share my thoughts and experience as a parent of Mokshitha M Gowda, who is currently studying in Class III, Section A2.

About the School:
SJR is more than just an academic institution; it is a community that nurtures children with care, values, and discipline. The school environment is safe, welcoming, and conducive to learning.

The Changes I See:
Over the past year, I have noticed significant positive changes in my daughter. Her reading, writing, and communication skills have improved remarkably. She has become more confident, curious, and enthusiastic about attending school every day. The balance between academics and extra-curricular activities has helped her develop a well-rounded personality.

My Expectations and Deliverables:
As a parent, I expected a school that provides quality education while also instilling strong moral values. SJR has truly delivered on this expectation. The teachers are approachable, dedicated, and give individual attention to each child, ensuring that no student is left behind.

Thank You:
I would like to express my sincere gratitude to the management, principal, and all the teachers for their continuous efforts, patience, and encouragement. Thank you for creating a positive impact on my child’s foundational years.

Warm regards,
Mahesh Gowda`,
    subheadings: [
      {
        title: "About the School",
        text: "SJR is more than just an academic institution; it is a community that nurtures children with care, values, and discipline. The school environment is safe, welcoming, and conducive to learning."
      },
      {
        title: "The Changes I See",
        text: "Over the past year, I have noticed significant positive changes in my daughter. Her reading, writing, and communication skills have improved remarkably. She has become more confident, curious, and enthusiastic about attending school every day. The balance between academics and extra-curricular activities has helped her develop a well-rounded personality."
      },
      {
        title: "My Expectations and Deliverables",
        text: "As a parent, I expected a school that provides quality education while also instilling strong moral values. SJR has truly delivered on this expectation. The teachers are approachable, dedicated, and give individual attention to each child, ensuring that no student is left behind."
      },
      {
        title: "Thank You",
        text: "I would like to express my sincere gratitude to the management, principal, and all the teachers for their continuous efforts, patience, and encouragement. Thank you for creating a positive impact on my child’s foundational years."
      }
    ]
  },
  {
    id: "testimonial-09",
    sourcePage: 9,
    parentName: "Veeresh Vajjarawad",
    childName: "Sanvi V Vajjarawad",
    className: "Class III A2",
    language: "en",
    image: "/images/testimonials/09-veeresh-vajjarawad.png",
    imageAlt: "Portrait of parent Veeresh Vajjarawad",
    quote: `I am very happy to share my feedback regarding SJR Public School, Rajajinagar. My daughter, Sanvi V Vajjarawad, is studying in 3rd standard 'A2' section, and she has been part of this wonderful institution since Nursery.

Over the years, we have seen tremendous growth in her academics, confidence, and overall personality. The school provides a safe, caring, and disciplined environment where children can learn and thrive happily.

The teachers are extremely dedicated, patient, and approachable. They encourage active participation in both curricular and co-curricular activities, which has helped my daughter become more curious and expressive.

I truly appreciate the school management and teachers for their continuous support and guidance. Proud to be associated with SJR Public School, Rajajinagar.`
  },
  {
    id: "testimonial-10",
    sourcePage: 10,
    parentName: "Tina Kiran",
    childName: "Kushal K",
    className: "Class III A1",
    language: "en",
    image: "/images/testimonials/10-tina-kiran.png",
    imageAlt: "Portrait of parent Tina Kiran",
    quote: `I am happy to share my experience as a parent of Kushal K, studying in Class III A1 at SJR Public School.

The school provides a positive and encouraging environment where my child feels happy and motivated to learn every day. I have seen great improvement in his reading, writing, and overall confidence. The teachers are dedicated, patient, and always supportive, ensuring individual attention to each student.

Along with academics, the school encourages values, discipline, and co-curricular activities, helping children in their overall development.

I sincerely thank the management and teachers for their continuous guidance and efforts in shaping my child’s future.

Proud to be part of the SJR family!`
  },
  {
    id: "testimonial-11",
    sourcePage: 11,
    parentName: "Saritha J",
    childName: "Chaitanya R",
    className: "Class III A1",
    language: "en",
    image: "/images/testimonials/11-saritha-j.png",
    imageAlt: "Portrait of parent Saritha J",
    quote: `We are extremely happy with our experience at SJR Public School, Rajajinagar. The school provides a nurturing and positive environment where our child feels motivated, safe, and happy to learn every day.

The teachers are dedicated, patient, and very approachable. They give personal attention to students, helping them grow not only academically but also in confidence and discipline. We have noticed significant improvement in our child’s reading, writing, communication, and social skills.

The school balances academics with creative activities, values, and physical education, ensuring holistic development. We truly appreciate the regular communication from the school and the continuous efforts of the Principal and teachers.

Thank you, SJR Public School, for building a strong foundation for our child’s future. We are proud to be part of the SJR family!`
  },
  {
    id: "testimonial-12",
    sourcePage: 12,
    parentName: "Arjun & Arunima",
    childName: "Aahan",
    className: "Class 1 A2",
    language: "en",
    image: "/images/testimonials/12-arjun-arunima.png",
    imageAlt: "Portrait of parents Arjun and Arunima",
    quote: `As parents of Aahan, currently in Class 1 A2, we are extremely happy with our journey at SJR Public School, Rajajinagar.

We have witnessed remarkable growth in our child’s confidence, communication, reading, and writing skills. The curriculum is thoughtfully designed, blending academic learning with creativity and values.

The teachers are warm, attentive, and deeply invested in each child’s development. The school’s positive atmosphere, individual care, and focus on holistic education make it a second home for our child.

We are truly grateful to the teachers and the school management for their dedication, guidance, and unwavering support. Proud to be associated with SJR Public School!`
  },
  {
    id: "testimonial-13",
    sourcePage: 13,
    parentName: "Narasimhappa N M",
    childName: "Deekshith N Gowda",
    className: "Class 8 A1",
    language: "en",
    image: "/images/testimonials/13-narasimhappa-n-m.png",
    imageAlt: "Portrait of parent Narasimhappa N M",
    quote: `As a parent of Deekshith N Gowda, studying in 8th Grade, section A1 at SJR Public School, I would like to express my sincere appreciation for the school's dedication to quality education.

The teachers are supportive, encouraging, and provide individual attention, which has greatly helped in my child's academic and personal growth. The school offers a safe and disciplined environment along with good infrastructure and balanced co-curricular activities.

Regular parent-teacher interactions keep us well informed about his progress. I am truly grateful to the management, principal, and teachers for their continuous efforts in shaping my child's future.`
  }
];
