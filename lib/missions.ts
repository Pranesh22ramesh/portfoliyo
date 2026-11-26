import type { DistrictId } from './city';

export const missions = [
  {id:'lab-tour',title:'First build',district:'projects',brief:'Reach Project Lab and see how the portfolio projects were built.'},
  {id:'it-park-meetup',title:'Office hours',district:'experience',brief:'Visit IT Park for Pranesh’s internship and campus leadership story.'},
  {id:'research-visit',title:'Signal hunt',district:'research',brief:'Reach the Research Center to explore the applied machine learning prototypes.'},
  {id:'museum-run',title:'Museum run',district:'achievements',brief:'Navigate to the Achievement Museum for credentials and awards.'},
] as const satisfies readonly {id:string;title:string;district:DistrictId;brief:string}[];

export type Mission=typeof missions[number];
export type MissionId=Mission['id'];
export function canCompleteMission(mission:Mission,near:DistrictId|null,interior:boolean){
  return !interior&&near===mission.district;
}
