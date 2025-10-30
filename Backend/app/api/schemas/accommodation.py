from pydantic import BaseModel, Field
from typing import Optional

class Accommodation(BaseModel):
    name: Optional[str] = Field(None, description="Nom de l'hébergement")
    carbon: Optional[float] = Field(None, alias="carbonFootprint", description="Empreinte carbone")
    region: Optional[str] = Field(None, description="Région")
    price: Optional[float] = Field(None, alias="pricePerNight", description="Prix par nuit")
    label: Optional[str] = Field(None, alias="ecoLabel", description="Label écologique")
    capacity: Optional[int] = Field(None, description="Capacité")
    
    class Config:
        populate_by_name = True
